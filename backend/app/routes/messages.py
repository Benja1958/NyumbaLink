from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.conversation import Conversation
from app.models.listing import Listing
from app.models.message import Message
from app.models.user import User
from app.schemas.message import (
    ConversationCreate,
    ConversationResponse,
    ConversationWithMessagesResponse,
    MessageCreate,
    MessageResponse,
)


router = APIRouter()

@router.post(
    "/conversations",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_conversation(
    payload: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "tenant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only tenants can start conversations",
        )

    listing = (
        db.query(Listing)
        .filter(Listing.id == payload.listing_id)
        .first()
    )

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    if not listing.is_available or not listing.is_approved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This listing is not available for messaging",
        )

    existing = (
        db.query(Conversation)
        .filter(
            Conversation.listing_id == listing.id,
            Conversation.tenant_id == current_user.id,
            Conversation.landlord_id == listing.landlord_id,
        )
        .first()
    )

    if existing:
        return existing

    conversation = Conversation(
        listing_id=listing.id,
        tenant_id=current_user.id,
        landlord_id=listing.landlord_id,
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation

@router.get(
    "/conversations",
    response_model=List[ConversationResponse],
)
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "tenant":
        query = db.query(Conversation).filter(
            Conversation.tenant_id == current_user.id
        )

    elif current_user.role == "landlord":
        query = db.query(Conversation).filter(
            Conversation.landlord_id == current_user.id
        )

    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Messaging is available only to tenants and landlords",
        )

    return query.order_by(
        Conversation.created_at.desc()
    ).all()

@router.get(
    "/conversations",
    response_model=List[ConversationResponse],
)
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "tenant":
        query = db.query(Conversation).filter(
            Conversation.tenant_id == current_user.id
        )

    elif current_user.role == "landlord":
        query = db.query(Conversation).filter(
            Conversation.landlord_id == current_user.id
        )

    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Messaging is available only to tenants and landlords",
        )

    return query.order_by(
        Conversation.created_at.desc()
    ).all()

@router.get(
    "/conversations/{conversation_id}",
    response_model=ConversationWithMessagesResponse,
)
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id)
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )

    if current_user.id not in {
        conversation.tenant_id,
        conversation.landlord_id,
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this conversation",
        )

    return conversation

@router.post(
    "/conversations/{conversation_id}/messages",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def send_message(
    conversation_id: int,
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id)
        .first()
    )

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )

    if current_user.id not in {
        conversation.tenant_id,
        conversation.landlord_id,
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this conversation",
        )

    content = payload.content.strip()

    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty",
        )

    message = Message(
        conversation_id=conversation.id,
        sender_id=current_user.id,
        content=content,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message