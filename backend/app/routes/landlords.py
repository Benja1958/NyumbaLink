from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)

import cloudinary.uploader

from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.listing import Listing
from app.schemas.user import (
    LandlordProfileResponse,
    LandlordProfileUpdate,
)

router = APIRouter()


def build_landlord_profile_response(
    landlord: User,
    db: Session,
):
    approved_listings_count = (
        db.query(Listing)
        .filter(
            Listing.landlord_id == landlord.id,
            Listing.approval_status == "approved",
        )
        .count()
    )

    return {
        "id": landlord.id,
        "full_name": landlord.full_name,
        "email": landlord.email,
        "phone_number": landlord.phone_number,
        "profile_image_url": landlord.profile_image_url,
        "about": landlord.about,
        "email_verified": landlord.email_verified,
        "is_verified_landlord":
            landlord.is_verified_landlord,
        "approved_listings_count":
            approved_listings_count,
        "created_at": landlord.created_at,
    }


@router.get(
    "/{landlord_id}",
    response_model=LandlordProfileResponse,
)
def get_landlord_profile(
    landlord_id: int,
    db: Session = Depends(get_db),
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

    return build_landlord_profile_response(
        landlord,
        db,
    )


@router.patch(
    "/me",
    response_model=LandlordProfileResponse,
)
def update_my_landlord_profile(
    payload: LandlordProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if current_user.role != "landlord":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only landlords can "
                "update landlord profiles"
            ),
        )

    if payload.full_name is not None:
        current_user.full_name = (
            payload.full_name.strip()
        )

    if payload.about is not None:
        current_user.about = (
            payload.about.strip()
        )

    db.commit()
    db.refresh(current_user)

    return build_landlord_profile_response(
        current_user,
        db,
    )


@router.post(
    "/me/profile-image",
)
async def upload_landlord_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    if current_user.role != "landlord":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only landlords can "
                "upload profile images"
            ),
        )

    if not file.content_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image file",
        )

    if not file.content_type.startswith(
        "image/"
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Profile image must "
                "be an image file"
            ),
        )

    try:
        upload_result = (
            cloudinary.uploader.upload(
                file.file,
                folder=(
                    "nyumbalink/"
                    "landlord_profiles"
                ),
                public_id=(
                    f"landlord_"
                    f"{current_user.id}"
                ),
                overwrite=True,
                resource_type="image",
            )
        )

        image_url = (
            upload_result.get(
                "secure_url"
            )
        )

        if not image_url:
            raise HTTPException(
                status_code=(
                    status.HTTP_500_INTERNAL_SERVER_ERROR
                ),
                detail=(
                    "Failed to upload "
                    "profile image"
                ),
            )

        current_user.profile_image_url = (
            image_url
        )

        db.commit()
        db.refresh(current_user)

        return {
            "message":
                "Profile image updated",
            "profile_image_url":
                current_user.profile_image_url,
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to upload "
                "profile image"
            ),
        )