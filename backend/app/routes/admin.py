from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import List
from sqlalchemy import func

from app.database import get_db
from app.dependencies.auth import require_admin
from app.dependencies.csrf import verify_csrf_token

from app.models.listing import Listing
from app.models.user import User
from app.models.report import Report

from app.schemas.report import AdminReportResponse
from app.schemas.listing import (
    ListingRejectRequest,
    ListingResponse,
)


router = APIRouter()


@router.get("/listings", response_model=List[ListingResponse])
def get_all_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    listings = db.query(Listing).all()

    return listings


@router.get("/listings/pending", response_model=List[ListingResponse])
def get_pending_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    listings = db.query(Listing).filter(Listing.approval_status == "pending").all()

    return listings


@router.patch("/listings/{listing_id}/approve", response_model=ListingResponse)
def approve_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
    _: None = Depends(verify_csrf_token),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    listing.approval_status = "approved"
    listing.is_approved = True
    listing.rejection_reason = None
    listing.rejected_by = None
    listing.rejected_at = None

    db.commit()
    db.refresh(listing)

    return listing


@router.patch(
    "/listings/{listing_id}/reject",
    response_model=ListingResponse,
)
def reject_listing(
    listing_id: int,
    rejection_data: ListingRejectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
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

    listing.approval_status = "rejected"
    listing.is_approved = False
    listing.rejection_reason = (
        rejection_data.reason.strip()
    )
    listing.rejected_by = current_user.id
    listing.rejected_at = datetime.now(
        timezone.utc
    )

    listing.is_verified_property = False
    listing.property_verified_at = None
    listing.property_verified_by = None

    db.commit()
    db.refresh(listing)

    return listing


@router.get(
    "/reports",
    response_model=List[AdminReportResponse],
)
def get_reports(
    report_status: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    query = db.query(Report)

    if report_status:
        allowed_statuses = {
            "pending",
            "dismissed",
            "action_taken",
        }

        if report_status not in allowed_statuses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid report status",
            )

        query = query.filter(
            Report.status == report_status
        )

    return (
        query
        .order_by(Report.created_at.desc())
        .all()
    )


@router.patch(
    "/reports/{report_id}/dismiss",
    response_model=AdminReportResponse,
)
def dismiss_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
    _: None = Depends(verify_csrf_token),
):
    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    if report.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This report has already been reviewed",
        )

    report.status = "dismissed"
    report.reviewed_by = current_user.id
    report.reviewed_at = datetime.now(
        timezone.utc
    )

    db.commit()
    db.refresh(report)

    return report


@router.patch(
    "/reports/{report_id}/suspend-listing",
    response_model=AdminReportResponse,
)
def suspend_reported_listing(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
    _: None = Depends(verify_csrf_token),
):
    report = (
        db.query(Report)
        .filter(Report.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    if report.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This report has already been reviewed",
        )

    listing = (
        db.query(Listing)
        .filter(
            Listing.id == report.listing_id
        )
        .first()
    )

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    listing.approval_status = "suspended"
    listing.is_approved = False
    listing.is_available = False

    report.status = "action_taken"
    report.reviewed_by = current_user.id
    report.reviewed_at = datetime.now(
        timezone.utc
    )
    
    listing.is_verified_property = False
    listing.property_verified_at = None
    listing.property_verified_by = None

    db.commit()
    db.refresh(report)

    return report


@router.patch(
    "/landlords/{landlord_id}/verify",
)
def verify_landlord(
    landlord_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
    _: None = Depends(verify_csrf_token),
):
    landlord = (
        db.query(User)
        .filter(
            User.id == landlord_id,
            User.role == "landlord",
        )
        .first()
    )

    if not landlord:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Landlord not found",
        )

    if not landlord.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Landlord email must be "
                "verified first"
            ),
        )

    landlord.is_verified_landlord = True

    db.commit()
    db.refresh(landlord)

    return {
        "message":
            "Landlord verified successfully",
        "landlord_id":
            landlord.id,
        "is_verified_landlord":
            landlord.is_verified_landlord,
    }


@router.patch(
    "/landlords/{landlord_id}/unverify",
)
def unverify_landlord(
    landlord_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
    _: None = Depends(verify_csrf_token),
):
    landlord = (
        db.query(User)
        .filter(
            User.id == landlord_id,
            User.role == "landlord",
        )
        .first()
    )

    if not landlord:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Landlord not found",
        )

    landlord.is_verified_landlord = False

    db.commit()
    db.refresh(landlord)

    return {
        "message":
            "Landlord verification removed",
        "landlord_id":
            landlord.id,
        "is_verified_landlord":
            landlord.is_verified_landlord,
    }


@router.get(
    "/landlords",
)
def get_landlords(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    landlords = (
        db.query(User)
        .filter(
            User.role == "landlord"
        )
        .order_by(
            User.created_at.desc()
        )
        .all()
    )

    results = []

    for landlord in landlords:
        approved_listings_count = (
            db.query(func.count(Listing.id))
            .filter(
                Listing.landlord_id
                == landlord.id,
                Listing.approval_status
                == "approved",
            )
            .scalar()
        )

        results.append(
            {
                "id": landlord.id,
                "full_name":
                    landlord.full_name,
                "email":
                    landlord.email,
                "profile_image_url":
                    landlord.profile_image_url,
                "email_verified":
                    landlord.email_verified,
                "is_verified_landlord":
                    landlord.is_verified_landlord,
                "approved_listings_count":
                    approved_listings_count,
                "created_at":
                    landlord.created_at,
            }
        )

    return results


@router.patch(
    "/listings/{listing_id}/verify-property",
    response_model=ListingResponse,
)
def verify_property(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
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

    if listing.approval_status != "approved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Only approved listings can be "
                "verified"
            ),
        )

    if listing.is_verified_property:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Property is already verified",
        )

    listing.is_verified_property = True
    listing.property_verified_at = datetime.now(
        timezone.utc
    )
    listing.property_verified_by = current_user.id

    db.commit()
    db.refresh(listing)

    return listing


@router.patch(
    "/listings/{listing_id}/unverify-property",
    response_model=ListingResponse,
)
def unverify_property(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
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

    if not listing.is_verified_property:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Property is not verified",
        )

    listing.is_verified_property = False
    listing.property_verified_at = None
    listing.property_verified_by = None

    db.commit()
    db.refresh(listing)

    return listing