from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class ListingImage(Base):
    __tablename__ = "listing_images"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    listing_id = Column(
        Integer,
        ForeignKey(
            "listings.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    image_url = Column(
        String,
        nullable=False,
    )

    public_id = Column(
        String,
        nullable=True,
    )

    position = Column(
        Integer,
        nullable=False,
        default=0,
    )

    is_cover = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    listing = relationship(
        "Listing",
        back_populates="images",
    )