from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.listing import Listing
from app.models.user import User
from app.schemas.listing import ListingCreate, ListingResponse
from app.dependencies.auth import get_current_user


router = APIRouter()


@router.post("/", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    listing_data: ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "landlord":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only landlords can create property listings",
        )

    new_listing = Listing(
        landlord_id=current_user.id,
        title=listing_data.title,
        description=listing_data.description,
        location=listing_data.location,
        monthly_rent=listing_data.monthly_rent,
        bedrooms=listing_data.bedrooms,
        bathrooms=listing_data.bathrooms,
        image_url=listing_data.image_url,
        amenities=listing_data.amenities,
    )

    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    return new_listing


@router.get("/", response_model=List[ListingResponse])
def get_listings(db: Session = Depends(get_db)):
    listings = (
        db.query(Listing)
        .filter(Listing.is_available == True)
        .filter(Listing.is_approved == True)
        .all()
    )

    return listings


@router.get("/my-listings", response_model=List[ListingResponse])
def get_my_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "landlord":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only landlords can view their own listings",
        )

    listings = db.query(Listing).filter(Listing.landlord_id == current_user.id).all()

    return listings


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(
    listing_id: int,
    db: Session = Depends(get_db),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    return listing