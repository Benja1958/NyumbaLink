export type ListingImage = {
  id: number;
  listing_id: number;
  image_url: string;
  position: number;
  is_cover: boolean;
  created_at: string;
};

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
  images: ListingImage[];
  amenities: string[];
  is_available: boolean;
  is_approved: boolean;
  approval_status: "pending" | "approved" | "rejected";
  created_at: string;
};