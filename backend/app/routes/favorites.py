from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List

from app.database import get_db
from app.dependencies.auth import require_tenant
from app.models.favorite import Favorite
from app.models.listing import Listing
from app.models.user import User
from app.schemas.favorite import FavoriteResponse, FavoriteWithListingResponse


router = APIRouter()


@router.post("/{listing_id}", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_favorite(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_tenant),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    if not listing.is_available or not listing.is_approved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only favorite approved and available listings",
        )

    favorite = Favorite(
        tenant_id=current_user.id,
        listing_id=listing_id,
    )

    db.add(favorite)

    try:
        db.commit()
        db.refresh(favorite)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Listing already saved to favorites",
        )

    return favorite


@router.get("/", response_model=List[FavoriteWithListingResponse])
def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_tenant),
):
    favorites = (
        db.query(Favorite)
        .filter(Favorite.tenant_id == current_user.id)
        .order_by(Favorite.created_at.desc())
        .all()
    )

    return favorites


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_tenant),
):
    favorite = (
        db.query(Favorite)
        .filter(Favorite.tenant_id == current_user.id)
        .filter(Favorite.listing_id == listing_id)
        .first()
    )

    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found",
        )

    db.delete(favorite)
    db.commit()

    return None