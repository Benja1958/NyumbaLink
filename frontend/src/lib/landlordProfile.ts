import { authFetch } from "@/lib/authFetch";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"
    : "https://nyumbalink-api.onrender.com";

export type LandlordProfile = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string | null;

  profile_image_url: string | null;
  about: string | null;

  email_verified: boolean;
  is_verified_landlord: boolean;

  approved_listings_count: number;
  created_at: string;
};

export type UpdateLandlordProfilePayload = {
  full_name?: string;
  about?: string;
};

export async function getLandlordProfile(
  landlordId: number
): Promise<LandlordProfile> {
  const url =
    typeof window === "undefined"
      ? `${API_URL}/landlords/${landlordId}`
      : `/backend-api/landlords/${landlordId}`;

  const response = await fetch(
    url,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const data = await response.json();

    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Failed to load landlord profile"
    );
  }

  return response.json();
}

export async function updateMyLandlordProfile(
  payload: UpdateLandlordProfilePayload
): Promise<LandlordProfile> {
  const response = await authFetch(
    "/backend-api/landlords/me",
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(
        payload
      ),
    }
  );

  if (!response.ok) {
    const data =
      await response.json();

    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Failed to update landlord profile"
    );
  }

  return response.json();
}

export async function uploadLandlordProfileImage(
  file: File
): Promise<{
  message: string;
  profile_image_url: string;
}> {
  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await authFetch(
      "/backend-api/landlords/me/profile-image",
      {
        method: "POST",
        body: formData,
      }
    );

  if (!response.ok) {
    const data =
      await response.json();

    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Failed to upload profile image"
    );
  }

  return response.json();
}