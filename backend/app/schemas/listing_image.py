from datetime import datetime

from pydantic import BaseModel


class ListingImageResponse(BaseModel):
    id: int
    listing_id: int
    image_url: str
    position: int
    is_cover: bool
    created_at: datetime

    class Config:
        from_attributes = True