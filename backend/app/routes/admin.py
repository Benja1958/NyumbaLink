from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.dependencies.auth import require_admin
from app.models.listing import Listing
from app.models.user import User
from app.schemas.listing import ListingResponse


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
    listings = db.query(Listing).filter(Listing.is_approved == False).all()

    return listings


@router.patch("/listings/{listing_id}/approve", response_model=ListingResponse)
def approve_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    listing.is_approved = True
    listing.is_available = True

    db.commit()
    db.refresh(listing)

    return listing


@router.patch("/listings/{listing_id}/reject", response_model=ListingResponse)
def reject_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    listing.is_approved = False
    listing.is_available = False

    db.commit()
    db.refresh(listing)

    return listing