from pydantic import BaseModel, EmailStr, field_validator
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
    def passwords_match(cls, confirm_password_value, info):
        password = info.data.get("password")
        if password and confirm_password_value != password:
            raise ValueError("Passwords do not match")
        return confirm_password_value


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None
    role: str
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