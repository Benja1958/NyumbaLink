from pydantic import BaseModel
from datetime import datetime

from app.schemas.listing import ListingResponse


class FavoriteResponse(BaseModel):
    id: int
    tenant_id: int
    listing_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class FavoriteWithListingResponse(BaseModel):
    id: int
    tenant_id: int
    listing_id: int
    created_at: datetime
    listing: ListingResponse

    class Config:
        from_attributes = True