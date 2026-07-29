import { Listing } from "@/types/listing";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export type Favorite = {
  id: number;
  tenant_id: number;
  listing_id: number;
  created_at: string;
};

export type FavoriteWithListing = Favorite & {
  listing: Listing;
};

function getToken(): string {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("You must be logged in");
  }

  return token;
}

export async function addFavorite(
  listingId: number
): Promise<Favorite> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/favorites/${listingId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Failed to save favorite"
    );
  }

  return response.json();
}

export async function removeFavorite(
  listingId: number
): Promise<void> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/favorites/${listingId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Failed to remove favorite"
    );
  }
}

export async function getFavorites(): Promise<
  FavoriteWithListing[]
> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/favorites/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }

  return response.json();
}

export async function getFavoriteStatus(
  listingId: number
): Promise<boolean> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/favorites/${listingId}/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to check favorite status");
  }

  const data = await response.json();

  return data.is_favorited;
}