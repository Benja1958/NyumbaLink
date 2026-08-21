import { authFetch } from "@/lib/authFetch";
import { Listing } from "@/types/listing";

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


// =====================================================
// Listings
// =====================================================

export async function getAllAdminListings(): Promise<
  Listing[]
> {
  const response = await authFetch(
    "/backend-api/admin/listings"
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to load listings"
      )
    );
  }

  return response.json();
}


export async function getPendingListings(): Promise<
  Listing[]
> {
  const response = await authFetch(
    "/backend-api/admin/listings/pending"
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to load pending listings"
      )
    );
  }

  return response.json();
}


export async function approveListing(
  listingId: number
): Promise<Listing> {
  const response = await authFetch(
    `/backend-api/admin/listings/${listingId}/approve`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to approve listing"
      )
    );
  }

  return response.json();
}


export async function rejectListing(
  listingId: number,
  reason: string
): Promise<Listing> {
  const response = await authFetch(
    `/backend-api/admin/listings/${listingId}/reject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        reason,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to reject listing"
      )
    );
  }

  return response.json();
}


export async function verifyProperty(
  listingId: number
): Promise<Listing> {
  const response = await authFetch(
    `/backend-api/admin/listings/${listingId}/verify-property`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to verify property"
      )
    );
  }

  return response.json();
}


export async function unverifyProperty(
  listingId: number
): Promise<Listing> {
  const response = await authFetch(
    `/backend-api/admin/listings/${listingId}/unverify-property`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to remove property verification"
      )
    );
  }

  return response.json();
}


// =====================================================
// Landlords
// =====================================================

export type AdminLandlord = {
  id: number;

  full_name: string;

  email: string;

  profile_image_url:
    | string
    | null;

  email_verified: boolean;

  is_verified_landlord:
    boolean;

  approved_listings_count:
    number;

  created_at: string;
};


export async function getAdminLandlords(): Promise<
  AdminLandlord[]
> {
  const response = await authFetch(
    "/backend-api/admin/landlords"
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to load landlords"
      )
    );
  }

  return response.json();
}


export async function verifyLandlord(
  landlordId: number
): Promise<void> {
  const response = await authFetch(
    `/backend-api/admin/landlords/${landlordId}/verify`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to verify landlord"
      )
    );
  }
}


export async function unverifyLandlord(
  landlordId: number
): Promise<void> {
  const response = await authFetch(
    `/backend-api/admin/landlords/${landlordId}/unverify`,
    {
      method: "PATCH",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to remove landlord verification"
      )
    );
  }
}