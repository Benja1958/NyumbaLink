from pydantic import (
    BaseModel,
    EmailStr,
    field_validator,
)
from typing import Optional, Literal
from datetime import datetime


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    password: str
    confirm_password: str
    role: Literal["tenant", "landlord"] = "tenant"

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(
        cls,
        confirm_password_value,
        info,
    ):
        password = info.data.get("password")

        if (
            password
            and confirm_password_value
            != password
        ):
            raise ValueError(
                "Passwords do not match"
            )

        return confirm_password_value


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    role: str

    email_verified: bool
    email_verified_at: Optional[
        datetime
    ] = None

    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class VerifyEmailRequest(BaseModel):
    token: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class LandlordProfileResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None

    profile_image_url: Optional[str] = None
    about: Optional[str] = None

    email_verified: bool
    is_verified_landlord: bool

    approved_listings_count: int = 0

    created_at: datetime

    class Config:
        from_attributes = True


class LandlordProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    about: Optional[str] = None