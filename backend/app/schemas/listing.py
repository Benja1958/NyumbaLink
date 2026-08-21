from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

from app.schemas.listing_image import (
    ListingImageResponse,
)


class ListingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    monthly_rent: float
    bedrooms: int
    bathrooms: int
    image_url: Optional[str] = None
    amenities: List[str] = Field(
        default_factory=list
    )


class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    monthly_rent: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    image_url: Optional[str] = None
    amenities: Optional[List[str]] = None
    is_available: Optional[bool] = None


class ListingResponse(BaseModel):
    id: int
    landlord_id: int

    title: str
    description: Optional[str] = None
    location: str

    monthly_rent: float

    bedrooms: int
    bathrooms: int

    image_url: Optional[str] = None

    amenities: List[str] = Field(
        default_factory=list
    )

    images: List[
        ListingImageResponse
    ] = Field(
        default_factory=list
    )

    is_available: bool

    is_approved: bool
    approval_status: str

    is_verified_property: bool

    property_verified_at: Optional[
        datetime
    ] = None

    created_at: datetime

    rejection_reason: Optional[str] = None

    rejected_at: Optional[
        datetime
    ] = None

    rejected_by: Optional[
        int
    ] = None

    last_availability_confirmed_at: Optional[
        datetime
    ] = None

    class Config:
        from_attributes = True


class ListingRejectRequest(BaseModel):
    reason: str = Field(
        min_length=5,
        max_length=1000,
    )