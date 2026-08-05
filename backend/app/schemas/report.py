from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


ALLOWED_REPORT_REASONS = {
    "Property does not exist",
    "Incorrect information",
    "Possible scam",
    "Duplicate listing",
    "Property is no longer available",
    "Other",
}


class ReportCreate(BaseModel):
    reason: str

    details: Optional[str] = Field(
        default=None,
        max_length=1000,
    )


class ReportListingResponse(BaseModel):
    id: int
    title: str
    location: str
    approval_status: str

    class Config:
        from_attributes = True


class ReportUserResponse(BaseModel):
    id: int
    full_name: str
    email: str

    class Config:
        from_attributes = True


class ReportResponse(BaseModel):
    id: int
    listing_id: int
    reporter_id: int
    reason: str
    details: Optional[str] = None
    status: str
    reviewed_by: Optional[int] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AdminReportResponse(ReportResponse):
    listing: ReportListingResponse
    reporter: ReportUserResponse