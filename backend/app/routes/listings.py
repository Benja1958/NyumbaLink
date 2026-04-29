from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.listing import Listing
from app.models.user import User
from app.schemas.listing import ListingCreate, ListingUpdate, ListingResponse
from app.dependencies.auth import get_current_user, require_landlord


router = APIRouter()


@router.post("/", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    listing_data: ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_landlord),
):
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
        is_approved=False,
    )

    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    return new_listing

@router.get("/", response_model=List[ListingResponse])
def get_listings(
    location: Optional[str] = None,
    min_rent: Optional[float] = None,
    max_rent: Optional[float] = None,
    bedrooms: Optional[int] = None,
    bathrooms: Optional[int] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = (
        db.query(Listing)
        .filter(Listing.is_available == True)
        .filter(Listing.is_approved == True)
    )

    if location:
        query = query.filter(Listing.location.ilike(f"%{location}%"))

    if min_rent is not None:
        query = query.filter(Listing.monthly_rent >= min_rent)

    if max_rent is not None:
        query = query.filter(Listing.monthly_rent <= max_rent)

    if bedrooms is not None:
        query = query.filter(Listing.bedrooms == bedrooms)

    if bathrooms is not None:
        query = query.filter(Listing.bathrooms == bathrooms)

    listings = (
        query.order_by(Listing.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return listings


@router.get("/my-listings", response_model=List[ListingResponse])
def get_my_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_landlord),
):
    listings = db.query(Listing).filter(Listing.landlord_id == current_user.id).all()

    return listings

@router.patch("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    listing_data: ListingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_landlord),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    if listing.landlord_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own listings",
        )

    update_data = listing_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(listing, field, value)

    db.commit()
    db.refresh(listing)

    return listing

@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_landlord),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    if listing.landlord_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own listings",
        )

    db.delete(listing)
    db.commit()

    return None


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

