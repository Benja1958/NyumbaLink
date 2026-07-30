from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.listing_image import ListingImageResponse


class ListingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    monthly_rent: float
    bedrooms: int
    bathrooms: int
    image_url: Optional[str] = None
    amenities: Optional[List[str]] = []

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
    approval_status: Optional[str] = None
    is_approved: Optional[bool] = None

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
    amenities: Optional[List[str]] = []
    images: List[ListingImageResponse] = []
    is_available: bool
    is_approved: bool
    approval_status: str
    created_at: datetime

    class Config:
        from_attributes = True

