from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)

    tenant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tenant = relationship("User", back_populates="favorites")
    listing = relationship("Listing", back_populates="favorites")

    __table_args__ = (
        UniqueConstraint("tenant_id", "listing_id", name="unique_tenant_listing_favorite"),
    )