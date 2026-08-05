const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

export const REPORT_REASONS = [
  "Property does not exist",
  "Incorrect information",
  "Possible scam",
  "Duplicate listing",
  "Property is no longer available",
  "Other",
] as const;

export type ReportReason =
  (typeof REPORT_REASONS)[number];

export type ReportStatus =
  | "pending"
  | "dismissed"
  | "action_taken";

export type Report = {
  id: number;
  listing_id: number;
  reporter_id: number;
  reason: string;
  details: string | null;
  status: ReportStatus;
  reviewed_by: number | null;
  created_at: string;
  reviewed_at: string | null;
};

export type AdminReportListing = {
  id: number;
  title: string;
  location: string;
  approval_status: string;
};

export type AdminReportUser = {
  id: number;
  full_name: string;
  email: string;
};

export type AdminReport = Report & {
  listing: AdminReportListing;
  reporter: AdminReportUser;
};

function getToken(): string {
  const token =
    localStorage.getItem("access_token");

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

export async function createReport(
  listingId: number,
  reason: ReportReason,
  details: string
): Promise<Report> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/reports/listings/${listingId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reason,
        details: details.trim() || null,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Failed to report listing"
      )
    );
  }

  return response.json();
}

export async function getMyReports(): Promise<
  Report[]
> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/reports/my-reports`,
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
        "Failed to load reports"
      )
    );
  }

  return response.json();
}

export async function getAdminReports(
  reportStatus?: ReportStatus
): Promise<AdminReport[]> {
  const token = getToken();

  const query = reportStatus
    ? `?report_status=${reportStatus}`
    : "";

  const response = await fetch(
    `${API_URL}/admin/reports${query}`,
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
        "Failed to load reports"
      )
    );
  }

  return response.json();
}

export async function dismissReport(
  reportId: number
): Promise<AdminReport> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/reports/${reportId}/dismiss`,
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
        "Failed to dismiss report"
      )
    );
  }

  return response.json();
}

export async function suspendReportedListing(
  reportId: number
): Promise<AdminReport> {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/admin/reports/${reportId}/suspend-listing`,
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
        "Failed to suspend listing"
      )
    );
  }

  return response.json();
}