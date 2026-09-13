import { authFetch } from "@/lib/authFetch";
import { LandlordAnalyticsResponse } from "@/types/analytics";

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

export async function getLandlordAnalytics(): Promise<LandlordAnalyticsResponse> {
  const response = await authFetch(
    "/backend-api/listings/analytics"
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to load your analytics"
      )
    );
  }

  return response.json();
}
