from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.sql import func

from app.database import Base


class Listing(Base):
    __tablename__ = "listings"

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

    created_at = Column(DateTime(timezone=True), server_default=func.now())