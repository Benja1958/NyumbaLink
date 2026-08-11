const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

let refreshPromise:
  Promise<boolean> | null = null;

async function performRefresh(): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_URL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    return response.ok;
  } catch {
    return false;
  }
}

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise =
      performRefresh().finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function handleExpiredSession(): never {
  localStorage.removeItem("user");

  // Cleanup only in case an old token
  // remains from the previous auth system.
  localStorage.removeItem(
    "access_token"
  );

  window.location.href = "/login";

  throw new Error("UNAUTHORIZED");
}

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const response = await fetch(
    input,
    {
      ...init,
      credentials: "include",
    }
  );

  // Normal successful request, or an error
  // unrelated to authentication.
  if (response.status !== 401) {
    return response;
  }

  // Access token may have expired.
  // Try refreshing it once.
  const refreshed =
    await refreshAccessToken();

  if (!refreshed) {
    handleExpiredSession();
  }

  // Retry the original request now that
  // the browser has a new access_token cookie.
  const retryResponse =
    await fetch(
      input,
      {
        ...init,
        credentials: "include",
      }
    );

  // If it still fails with 401, the session
  // cannot be recovered.
  if (
    retryResponse.status === 401
  ) {
    handleExpiredSession();
  }

  return retryResponse;
}