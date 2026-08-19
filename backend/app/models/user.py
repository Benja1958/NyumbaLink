from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)
    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
    )
    phone_number = Column(
        String,
        unique=True,
        index=True,
        nullable=True,
    )

    password_hash = Column(String, nullable=False)

    role = Column(
        String,
        nullable=False,
        default="tenant",
    )
    # possible roles: tenant, landlord, admin

    email_verified = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    email_verified_at = Column(
        DateTime(timezone=True),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    favorites = relationship(
        "Favorite",
        back_populates="tenant",
        cascade="all, delete-orphan",
    )

    tenant_conversations = relationship(
        "Conversation",
        foreign_keys="Conversation.tenant_id",
        back_populates="tenant",
    )

    landlord_conversations = relationship(
        "Conversation",
        foreign_keys="Conversation.landlord_id",
        back_populates="landlord",
    )

    sent_messages = relationship(
        "Message",
        foreign_keys="Message.sender_id",
        back_populates="sender",
    )

    submitted_reports = relationship(
        "Report",
        foreign_keys="Report.reporter_id",
        back_populates="reporter",
        cascade="all, delete-orphan",
    )

    reviewed_reports = relationship(
        "Report",
        foreign_keys="Report.reviewed_by",
        back_populates="reviewer",
    )

    email_verification_tokens = relationship(
        "EmailVerificationToken",
        back_populates="user",
        cascade="all, delete-orphan",
    )