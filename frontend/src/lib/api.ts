import { Listing } from "@/types/listing";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export type ListingFilters = {
  location?: string;
  min_rent?: number;
  max_rent?: number;
  bedrooms?: number;
  bathrooms?: number;
  skip?: number;
  limit?: number;
};

export async function getListings(
  filters: ListingFilters = {}
): Promise<Listing[]> {
  const params = new URLSearchParams();

  if (filters.location) {
    params.set("location", filters.location);
  }

  if (filters.min_rent !== undefined) {
    params.set("min_rent", filters.min_rent.toString());
  }

  if (filters.max_rent !== undefined) {
    params.set("max_rent", filters.max_rent.toString());
  }

  if (filters.bedrooms !== undefined) {
    params.set("bedrooms", filters.bedrooms.toString());
  }

  if (filters.bathrooms !== undefined) {
    params.set("bathrooms", filters.bathrooms.toString());
  }

  if (filters.skip !== undefined) {
    params.set("skip", filters.skip.toString());
  }

  if (filters.limit !== undefined) {
    params.set("limit", filters.limit.toString());
  }

  const query = params.toString();

  const url = query
    ? `${API_URL}/listings/?${query}`
    : `${API_URL}/listings/`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch listings: ${response.status}`);
  }

  return response.json();
}

export async function getListing(
  id: number
): Promise<Listing> {
  const response = await fetch(
    `${API_URL}/listings/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch listing: ${response.status}`
    );
  }

  return response.json();
}