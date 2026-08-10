import { Listing } from "@/types/listing";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type Favorite = {
  id: number;
  tenant_id: number;
  listing_id: number;
  created_at: string;
};

export type FavoriteWithListing = Favorite & {
  listing: Listing;
};

function handleUnauthorized(
  response: Response
) {
  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
}

export async function addFavorite(
  listingId: number
): Promise<Favorite> {
  const response = await fetch(
    `${API_URL}/favorites/${listingId}`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  handleUnauthorized(response);

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
  const response = await fetch(
    `${API_URL}/favorites/${listingId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  handleUnauthorized(response);

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
  const response = await fetch(
    `${API_URL}/favorites/`,
    {
      credentials: "include",
    }
  );

  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }

  return response.json();
}

export async function getFavoriteStatus(
  listingId: number
): Promise<boolean> {
  const response = await fetch(
    `${API_URL}/favorites/${listingId}/status`,
    {
      credentials: "include",
    }
  );

  handleUnauthorized(response);

  if (!response.ok) {
    throw new Error("Failed to check favorite status");
  }

  const data = await response.json();

  return data.is_favorited;
}
