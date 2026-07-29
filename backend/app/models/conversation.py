from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    listing_id = Column(
        Integer,
        ForeignKey("listings.id"),
        nullable=False,
    )

    tenant_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    landlord_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    listing = relationship(
        "Listing",
        back_populates="conversations",
    )

    tenant = relationship(
        "User",
        foreign_keys=[tenant_id],
        back_populates="tenant_conversations",
    )

    landlord = relationship(
        "User",
        foreign_keys=[landlord_id],
        back_populates="landlord_conversations",
    )

    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint(
            "listing_id",
            "tenant_id",
            "landlord_id",
            name="unique_listing_tenant_landlord_conversation",
        ),
    )