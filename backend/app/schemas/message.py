from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.schemas.listing_image import ListingImageResponse


class ConversationCreate(BaseModel):
    listing_id: int


class MessageCreate(BaseModel):
    content: str


class ParticipantResponse(BaseModel):
    id: int
    full_name: str
    role: str

    class Config:
        from_attributes = True


class ConversationListingResponse(BaseModel):
    id: int
    title: str
    location: str
    image_url: Optional[str] = None
    images: list[ListingImageResponse] = Field(
        default_factory=list
    )
    monthly_rent: float

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    content: str
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LatestMessageResponse(BaseModel):
    id: int
    sender_id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    id: int
    listing_id: int
    tenant_id: int
    landlord_id: int
    created_at: datetime

    listing: ConversationListingResponse
    tenant: ParticipantResponse
    landlord: ParticipantResponse

    latest_message: Optional[
        LatestMessageResponse
    ] = None

    unread_count: int = 0

    class Config:
        from_attributes = True


class ConversationWithMessagesResponse(
    ConversationResponse
):
    messages: list[MessageResponse] = Field(
        default_factory=list
    )