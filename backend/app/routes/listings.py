from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from app.database import get_db
from app.models.conversation import Conversation
from app.models.favorite import Favorite
from app.models.listing import Listing
from app.models.message import Message
from app.models.user import User
from app.schemas.analytics import (
    LandlordAnalyticsResponse,
    ListingAnalyticsItem,
)
from app.schemas.listing import ListingCreate, ListingUpdate, ListingResponse
from app.dependencies.auth import (
    get_current_user,
    get_current_user_optional,
    require_landlord,
)
from app.dependencies.csrf import verify_csrf_token


router = APIRouter()


@router.post("/", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    listing_data: ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_landlord),
    _: None = Depends(verify_csrf_token),
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
        approval_status="pending",
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
        .filter(Listing.approval_status == "approved")
    )

    if location:
        query = query.filter(Listing.location.ilike(f"%{location}%"))

    if min_rent is not None:
        query = query.filter(Listing.monthly_rent >= min_rent)

    if max_rent is not None:
        query = query.filter(Listing.monthly_rent <= max_rent)

    if bedrooms is not None:
        query = query.filter(Listing.bedrooms >= bedrooms)

    if bathrooms is not None:
        query = query.filter(Listing.bathrooms >= bathrooms)

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


@router.get(
    "/analytics",
    response_model=LandlordAnalyticsResponse,
)
def get_landlord_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_landlord),
):
    listings = (
        db.query(Listing)
        .filter(Listing.landlord_id == current_user.id)
        .all()
    )

    listing_ids = [listing.id for listing in listings]

    favorites_by_listing = dict(
        db.query(
            Favorite.listing_id,
            func.count(Favorite.id),
        )
        .filter(Favorite.listing_id.in_(listing_ids))
        .group_by(Favorite.listing_id)
        .all()
    )

    conversations_by_listing = dict(
        db.query(
            Conversation.listing_id,
            func.count(Conversation.id),
        )
        .filter(Conversation.listing_id.in_(listing_ids))
        .group_by(Conversation.listing_id)
        .all()
    )

    messages_received_by_listing = dict(
        db.query(
            Conversation.listing_id,
            func.count(Message.id),
        )
        .join(Message, Message.conversation_id == Conversation.id)
        .filter(
            Conversation.listing_id.in_(listing_ids),
            Message.sender_id != current_user.id,
        )
        .group_by(Conversation.listing_id)
        .all()
    )

    items = []

    for listing in listings:
        views = listing.views_count or 0
        conversations = conversations_by_listing.get(listing.id, 0)

        conversion_rate = (
            round(conversations / views * 100, 1)
            if views > 0
            else 0.0
        )

        items.append(
            ListingAnalyticsItem(
                id=listing.id,
                title=listing.title,
                views_count=views,
                favorites_count=favorites_by_listing.get(listing.id, 0),
                messages_received=messages_received_by_listing.get(listing.id, 0),
                availability_confirmations_count=(
                    listing.availability_confirmations_count or 0
                ),
                conversion_rate=conversion_rate,
            )
        )

    # Highest-performing listings first.
    items.sort(key=lambda item: item.views_count, reverse=True)

    total_views = sum(item.views_count for item in items)
    total_conversations = sum(conversations_by_listing.values())

    overall_conversion_rate = (
        round(total_conversations / total_views * 100, 1)
        if total_views > 0
        else 0.0
    )

    return LandlordAnalyticsResponse(
        total_views=total_views,
        total_favorites=sum(item.favorites_count for item in items),
        total_messages_received=sum(item.messages_received for item in items),
        total_availability_confirmations=sum(
            item.availability_confirmations_count for item in items
        ),
        conversion_rate=overall_conversion_rate,
        listings=items,
    )


@router.patch("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    listing_data: ListingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_landlord),
    _: None = Depends(verify_csrf_token),
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
        if field == "approval_status":
            setattr(listing, field, value)
            setattr(listing, "is_approved", value == "approved")
        else:
            setattr(listing, field, value)

    db.commit()
    db.refresh(listing)

    return listing

@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_landlord),
    _: None = Depends(verify_csrf_token),
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
    current_user: User | None = Depends(get_current_user_optional),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    # Don't count a landlord viewing their own listing.
    if current_user is None or current_user.id != listing.landlord_id:
        listing.views_count = (listing.views_count or 0) + 1
        db.commit()
        db.refresh(listing)

    return listing


@router.patch(
    "/{listing_id}/resubmit",
    response_model=ListingResponse,
)
def resubmit_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_landlord),
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

    if listing.landlord_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot modify this listing",
        )

    if listing.approval_status != "rejected":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only rejected listings can be resubmitted",
        )

    listing.approval_status = "pending"
    listing.is_approved = False
    listing.rejection_reason = None
    listing.rejected_at = None
    listing.rejected_by = None

    db.commit()
    db.refresh(listing)

    return listing


@router.patch(
    "/{listing_id}/confirm-availability",
    response_model=ListingResponse,
)
def confirm_listing_availability(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_landlord),
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

    if listing.landlord_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot modify this listing",
        )

    listing.is_available = True

    listing.last_availability_confirmed_at = (
        datetime.now(timezone.utc)
    )

    listing.availability_confirmations_count = (
        (listing.availability_confirmations_count or 0) + 1
    )

    db.commit()
    db.refresh(listing)

    return listing


@router.patch(
    "/{listing_id}/mark-rented",
    response_model=ListingResponse,
)
def mark_listing_as_rented(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_landlord),
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

    if listing.landlord_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot modify this listing",
        )

    listing.is_available = False

    db.commit()
    db.refresh(listing)

    return listing
