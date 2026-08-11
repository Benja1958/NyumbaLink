from typing import Annotated
import cloudinary.uploader
from sqlalchemy import func

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import require_landlord
from app.dependencies.csrf import verify_csrf_token
from app.models.listing import Listing
from app.models.listing_image import ListingImage
from app.models.user import User
from app.schemas.listing_image import ListingImageResponse

# Importing this module configures the Cloudinary SDK.
from app.utils import cloudinary as cloudinary_config


router = APIRouter()

MAX_IMAGES = 10
MAX_FILE_SIZE = 5 * 1024 * 1024

ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


@router.post(
    "/{listing_id}/images",
    response_model=list[ListingImageResponse],
    status_code=status.HTTP_201_CREATED,
)
def upload_listing_images(
    listing_id: int,
    files: Annotated[
        list[UploadFile],
        File(description="Property images"),
    ],
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

    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Select at least one image",
        )

    max_position = (
        db.query(func.max(ListingImage.position))
        .filter(
            ListingImage.listing_id == listing_id
        )
        .scalar()
    )

    next_position = (
        max_position + 1
        if max_position is not None
        else 0
    )

    existing_count = (
        db.query(ListingImage)
        .filter(ListingImage.listing_id == listing_id)
        .count()
    )

    if existing_count + len(files) > MAX_IMAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A listing can have at most {MAX_IMAGES} images",
        )

    uploaded_images = []
    uploaded_public_ids = []

    try:
        for index, file in enumerate(files):
            if file.content_type not in ALLOWED_CONTENT_TYPES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"{file.filename} has an unsupported file type. "
                        "Only JPG, PNG, and WEBP are allowed."
                    ),
                )

            contents = file.file.read()

            if len(contents) > MAX_FILE_SIZE:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        f"{file.filename} exceeds the "
                        "5 MB file size limit."
                    ),
                )

            file.file.seek(0)

            result = cloudinary.uploader.upload(
                file.file,
                folder=f"nyumbalink/listings/{listing_id}",
                resource_type="image",
            )

            public_id = result["public_id"]

            uploaded_public_ids.append(public_id)

            image = ListingImage(
                listing_id=listing_id,
                image_url=result["secure_url"],
                public_id=public_id,
                position=next_position + index,
                is_cover=(
                    existing_count == 0
                    and index == 0
                ),
            )

            db.add(image)
            uploaded_images.append(image)

        db.commit()

        for image in uploaded_images:
            db.refresh(image)

        return uploaded_images

    except HTTPException:
        db.rollback()

        for public_id in uploaded_public_ids:
            try:
                cloudinary.uploader.destroy(public_id)
            except Exception:
                pass

        raise

    except Exception:
        db.rollback()

        for public_id in uploaded_public_ids:
            try:
                cloudinary.uploader.destroy(public_id)
            except Exception:
                pass

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload images",
        )


@router.patch(
    "/{listing_id}/images/{image_id}/cover",
    response_model=ListingImageResponse,
)
def set_cover_image(
    listing_id: int,
    image_id: int,
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

    image = (
        db.query(ListingImage)
        .filter(
            ListingImage.id == image_id,
            ListingImage.listing_id == listing_id,
        )
        .first()
    )

    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )

    (
        db.query(ListingImage)
        .filter(
            ListingImage.listing_id == listing_id
        )
        .update(
            {
                ListingImage.is_cover: False
            },
            synchronize_session=False,
        )
    )

    image.is_cover = True

    db.commit()
    db.refresh(image)

    return image


@router.delete(
    "/{listing_id}/images/{image_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_listing_image(
    listing_id: int,
    image_id: int,
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

    image = (
        db.query(ListingImage)
        .filter(
            ListingImage.id == image_id,
            ListingImage.listing_id == listing_id,
        )
        .first()
    )

    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )

    # For the MVP, don't allow the last image to be deleted.
    image_count = (
        db.query(ListingImage)
        .filter(ListingImage.listing_id == listing_id)
        .count()
    )

    if image_count <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A listing must have at least one image",
        )

    was_cover = image.is_cover

    result = cloudinary.uploader.destroy(
        image.public_id
    )

    if result.get("result") not in {
        "ok",
        "not found",
    }:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to delete image from storage",
        )

    db.delete(image)
    db.commit()

    # If the deleted image was the cover, make the
    # first remaining image the new cover.
    if was_cover:
        next_image = (
            db.query(ListingImage)
            .filter(
                ListingImage.listing_id == listing_id
            )
            .order_by(ListingImage.position)
            .first()
        )

        if next_image:
            next_image.is_cover = True
            db.commit()

    return None
