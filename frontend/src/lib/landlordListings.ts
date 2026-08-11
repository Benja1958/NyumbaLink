import { authFetch } from "@/lib/authFetch";
import { Listing } from "@/types/listing";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data.detail === "string") {
      return data.detail;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export type ListingPayload = {
  title: string;
  description: string;
  location: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  is_available: boolean;
};

export async function getMyListings(): Promise<Listing[]> {
  const response = await authFetch(
    `${API_URL}/listings/my-listings`
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to fetch your listings"
      )
    );
  }

  return response.json();
}

export async function createListing(
  payload: ListingPayload
): Promise<Listing> {
  const response = await authFetch(`${API_URL}/listings/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to create listing"
      )
    );
  }

  return response.json();
}

export async function updateListing(
  listingId: number,
  payload: ListingPayload
): Promise<Listing> {
  const response = await authFetch(
    `${API_URL}/listings/${listingId}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to update listing"
      )
    );
  }

  return response.json();
}

export async function deleteListing(
  listingId: number
): Promise<void> {
  const response = await authFetch(
    `${API_URL}/listings/${listingId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to delete listing"
      )
    );
  }
}

export async function resubmitListing(
  listingId: number
): Promise<Listing> {
  const response = await authFetch(
    `${API_URL}/listings/${listingId}/resubmit`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to resubmit listing"
      )
    );
  }

  return response.json();
}

export async function confirmListingAvailability(
  listingId: number
): Promise<Listing> {
  const response = await authFetch(
    `${API_URL}/listings/${listingId}/confirm-availability`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to confirm availability"
      )
    );
  }

  return response.json();
}

export async function markListingAsRented(
  listingId: number
): Promise<Listing> {
  const response = await authFetch(
    `${API_URL}/listings/${listingId}/mark-rented`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to mark listing as rented"
      )
    );
  }

  return response.json();
}
