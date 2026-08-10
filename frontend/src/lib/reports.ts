const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

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

export async function createReport(
  listingId: number,
  reason: ReportReason,
  details: string
): Promise<Report> {
  const response = await fetch(
    `${API_URL}/reports/listings/${listingId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reason,
        details: details.trim() || null,
      }),
    }
  );

  handleUnauthorized(response);

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
  const response = await fetch(
    `${API_URL}/reports/my-reports`,
    {
      credentials: "include",
    }
  );

  handleUnauthorized(response);

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
  const query = reportStatus
    ? `?report_status=${reportStatus}`
    : "";

  const response = await fetch(
    `${API_URL}/admin/reports${query}`,
    {
      credentials: "include",
    }
  );

  handleUnauthorized(response);

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
  const response = await fetch(
    `${API_URL}/admin/reports/${reportId}/dismiss`,
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
        "Failed to dismiss report"
      )
    );
  }

  return response.json();
}

export async function suspendReportedListing(
  reportId: number
): Promise<AdminReport> {
  const response = await fetch(
    `${API_URL}/admin/reports/${reportId}/suspend-listing`,
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
        "Failed to suspend listing"
      )
    );
  }

  return response.json();
}
