from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    JSON,
    String,
    Text,
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Listing(Base):
    __tablename__ = "listings"

    __table_args__ = (
        Index(
            "ix_listings_browse",
            "approval_status",
            "is_available",
            "created_at",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    landlord_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=False)

    monthly_rent = Column(Float, nullable=False)

    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Integer, nullable=False)

    image_url = Column(String, nullable=True)

    amenities = Column(JSON, nullable=True)

    is_available = Column(Boolean, default=True)
    is_approved = Column(Boolean, default=False)
    approval_status = Column(String, nullable=False, default="pending")

    is_verified_property = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    property_verified_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    property_verified_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    favorites = relationship(
        "Favorite", 
        back_populates="listing", 
        cascade="all, delete-orphan")

    conversations = relationship(
        "Conversation",
        back_populates="listing",
        cascade="all, delete-orphan",
    )

    images = relationship(
        "ListingImage",
        back_populates="listing",
        cascade="all, delete-orphan",
        order_by="ListingImage.position",
    )

    reports = relationship(
        "Report",
        back_populates="listing",
        cascade="all, delete-orphan",
    )

    rejection_reason = Column(
        Text,
        nullable=True,
    )

    rejected_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    rejected_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    last_availability_confirmed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )