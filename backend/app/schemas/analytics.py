from typing import List

from pydantic import BaseModel


class ListingAnalyticsItem(BaseModel):
    id: int
    title: str

    views_count: int
    favorites_count: int
    messages_received: int
    availability_confirmations_count: int

    # Percentage of views that turned into a
    # tenant starting a conversation, 0-100.
    conversion_rate: float

    class Config:
        from_attributes = True


class LandlordAnalyticsResponse(BaseModel):
    total_views: int
    total_favorites: int
    total_messages_received: int
    total_availability_confirmations: int

    # Percentage of views that turned into a
    # tenant starting a conversation, 0-100.
    conversion_rate: float

    listings: List[ListingAnalyticsItem]


class ReportsBreakdown(BaseModel):
    pending: int
    dismissed: int
    action_taken: int


class AdminAnalyticsResponse(BaseModel):
    # Non-admin users who logged in within
    # the last 30 days.
    active_users: int

    listings_created: int
    pending_approvals: int
    suspended_listings: int

    reports_received: int
    reports_breakdown: ReportsBreakdown
