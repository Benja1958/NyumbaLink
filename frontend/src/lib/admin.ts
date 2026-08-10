import { Listing } from "@/types/listing";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

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

function handleUnauthorized(
  response: Response
) {
  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }
}

export async function getAllAdminListings(): Promise<
  Listing[]
> {
  const response = await fetch(
    `${API_URL}/admin/listings`,
    {
      credentials: "include",
    }
  );

  handleUnauthorized(response);

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
  const response = await fetch(
    `${API_URL}/admin/listings/pending`,
    {
      credentials: "include",
    }
  );

  handleUnauthorized(response);

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
  const response = await fetch(
    `${API_URL}/admin/listings/${listingId}/approve`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  handleUnauthorized(response);

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
  const response = await fetch(
    `${API_URL}/admin/listings/${listingId}/reject`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason,
      }),
    }
  );

  handleUnauthorized(response);

  if (!response.ok) {
    let message =
      "Failed to reject listing";

    try {
      const data =
        await response.json();

      if (
        typeof data.detail === "string"
      ) {
        message = data.detail;
      }
    } catch {
      // Keep fallback message.
    }

    throw new Error(message);
  }

  return response.json();
}
