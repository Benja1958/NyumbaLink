import { ListingImage } from "@/types/listing";

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

export async function uploadListingImages(
  listingId: number,
  files: File[]
): Promise<ListingImage[]> {
  if (files.length === 0) {
    throw new Error("Select at least one image");
  }

  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(
    `${API_URL}/listings/${listingId}/images`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );

  handleUnauthorized(response);

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
  const response = await fetch(
    `${API_URL}/listings/${listingId}/images/${imageId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  handleUnauthorized(response);

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
  const response = await fetch(
    `${API_URL}/listings/${listingId}/images/${imageId}/cover`,
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
        "Failed to set cover image"
      )
    );
  }

  return response.json();
}
