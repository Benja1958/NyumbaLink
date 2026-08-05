from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Report(Base):
    __tablename__ = "reports"

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

    reporter_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    reason = Column(
        String,
        nullable=False,
    )

    details = Column(
        Text,
        nullable=True,
    )

    status = Column(
        String,
        nullable=False,
        default="pending",
    )
    # pending, dismissed, action_taken

    reviewed_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    reviewed_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    listing = relationship(
        "Listing",
        back_populates="reports",
    )

    reporter = relationship(
        "User",
        foreign_keys=[reporter_id],
        back_populates="submitted_reports",
    )

    reviewer = relationship(
        "User",
        foreign_keys=[reviewed_by],
        back_populates="reviewed_reports",
    )

    __table_args__ = (
        UniqueConstraint(
            "listing_id",
            "reporter_id",
            name="unique_listing_reporter",
        ),
    )