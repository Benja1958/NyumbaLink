export type Listing = {
  id: number;
  landlord_id: number;
  title: string;
  description: string;
  location: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  image_url: string;
  amenities: string[];
  is_available: boolean;
  is_approved: boolean;
  approval_status: "pending" | "approved" | "rejected";
  created_at: string;
};