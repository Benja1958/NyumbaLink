export type ListingAnalyticsItem = {
  id: number;
  title: string;

  views_count: number;
  favorites_count: number;
  messages_received: number;
  availability_confirmations_count: number;

  // Percentage, 0-100.
  conversion_rate: number;
};

export type LandlordAnalyticsResponse = {
  total_views: number;
  total_favorites: number;
  total_messages_received: number;
  total_availability_confirmations: number;

  // Percentage, 0-100.
  conversion_rate: number;

  listings: ListingAnalyticsItem[];
};

export type ReportsBreakdown = {
  pending: number;
  dismissed: number;
  action_taken: number;
};

export type AdminAnalyticsResponse = {
  active_users: number;
  listings_created: number;
  pending_approvals: number;
  suspended_listings: number;

  reports_received: number;
  reports_breakdown: ReportsBreakdown;
};
