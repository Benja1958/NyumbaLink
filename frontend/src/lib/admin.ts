import { Listing } from "@/types/listing";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

function getToken(): string {
  const token =
    localStorage.getItem("access_token");

  if (!token) {
    throw new Error(
      "You must be logged in"
    );
  }

  return token;
}

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

export async function getAllAdminListings(): Promise<
  Listing[]
> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/listings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
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
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/listings/pending`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
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
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/listings/${listingId}/approve`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  listingId: number
): Promise<Listing> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/listings/${listingId}/reject`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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