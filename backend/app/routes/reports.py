from typing import List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import require_tenant
from app.dependencies.csrf import verify_csrf_token
from app.models.listing import Listing
from app.models.report import Report
from app.models.user import User
from app.schemas.report import (
    ALLOWED_REPORT_REASONS,
    ReportCreate,
    ReportResponse,
)


router = APIRouter()


@router.post(
    "/listings/{listing_id}",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_report(
    listing_id: int,
    report_data: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_tenant),
    _: None = Depends(verify_csrf_token),
):
    listing = (
        db.query(Listing)
        .filter(Listing.id == listing_id)
        .first()
    )

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    if report_data.reason not in ALLOWED_REPORT_REASONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report reason",
        )

    if (
        report_data.reason == "Other"
        and not report_data.details
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide details when selecting Other",
        )

    report = Report(
        listing_id=listing_id,
        reporter_id=current_user.id,
        reason=report_data.reason,
        details=report_data.details,
    )

    db.add(report)

    try:
        db.commit()
        db.refresh(report)
    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reported this listing",
        )

    return report


@router.get(
    "/my-reports",
    response_model=List[ReportResponse],
)
def get_my_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_tenant),
):
    reports = (
        db.query(Report)
        .filter(
            Report.reporter_id
            == current_user.id
        )
        .order_by(
            Report.created_at.desc()
        )
        .all()
    )

    return reports
