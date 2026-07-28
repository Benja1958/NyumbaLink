import { Listing } from "@/types/listing";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export async function getListings(): Promise<Listing[]> {
  const response = await fetch(`${API_URL}/listings/`, {
  cache: "no-store",
});

  if (!response.ok) {
    throw new Error(`Failed to fetch listings: ${response.status}`);
  }

  return response.json();
}