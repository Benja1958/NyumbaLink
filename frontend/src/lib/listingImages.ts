import { ListingImage } from "@/types/listing";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

function getToken(): string {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("You must be logged in");
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

export async function uploadListingImages(
  listingId: number,
  files: File[]
): Promise<ListingImage[]> {
  if (files.length === 0) {
    throw new Error("Select at least one image");
  }

  const token = getToken();

  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(
    `${API_URL}/listings/${listingId}/images`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to upload property images"
      )
    );
  }

  return response.json();
}

export async function deleteListingImage(
  listingId: number,
  imageId: number
): Promise<void> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/listings/${listingId}/images/${imageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to delete image"
      )
    );
  }
}

export async function setListingCoverImage(
  listingId: number,
  imageId: number
): Promise<ListingImage> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/listings/${listingId}/images/${imageId}/cover`,
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
        "Failed to set cover image"
      )
    );
  }

  return response.json();
}