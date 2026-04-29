from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


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
    is_available: bool
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True

