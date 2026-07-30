from datetime import datetime

from pydantic import BaseModel


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
    image_url: str
    monthly_rent: float

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
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

    class Config:
        from_attributes = True


class ConversationWithMessagesResponse(
    ConversationResponse
):
    messages: list[MessageResponse] = []