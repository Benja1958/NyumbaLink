const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

let refreshPromise:
  Promise<boolean> | null = null;

function getCsrfToken():
  string | null {
  if (
    typeof document ===
    "undefined"
  ) {
    return null;
  }

  const cookies =
    document.cookie.split("; ");

  const csrfCookie =
    cookies.find((cookie) =>
      cookie.startsWith(
        "csrf_token="
      )
    );

  if (!csrfCookie) {
    return null;
  }

  return decodeURIComponent(
    csrfCookie.split("=")[1]
  );
}

function isStateChangingMethod(
  method?: string
): boolean {
  const normalizedMethod =
    (
      method ?? "GET"
    ).toUpperCase();

  return [
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ].includes(
    normalizedMethod
  );
}

function buildAuthInit(
  init: RequestInit
): RequestInit {
  const headers =
    new Headers(
      init.headers ?? {}
    );

  if (
    isStateChangingMethod(
      init.method
    )
  ) {
    const csrfToken =
      getCsrfToken();

    if (csrfToken) {
      headers.set(
        "X-CSRF-Token",
        csrfToken
      );
    }
  }

  return {
    ...init,
    credentials: "include",
    headers,
  };
}

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
      performRefresh().finally(
        () => {
          refreshPromise = null;
        }
      );
  }

  return refreshPromise;
}

function handleExpiredSession(): never {
  localStorage.removeItem(
    "user"
  );

  localStorage.removeItem(
    "access_token"
  );

  const isLoginPage =
    window.location.pathname ===
    "/login";

  if (!isLoginPage) {
    window.location.href =
      "/login?reason=session-expired";
  }

  throw new Error(
    "UNAUTHORIZED"
  );
}

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const requestInit =
    buildAuthInit(init);

  const response = await fetch(
    input,
    requestInit
  );

  if (
    response.status !== 401
  ) {
    return response;
  }

  const refreshed =
    await refreshAccessToken();

  if (!refreshed) {
    handleExpiredSession();
  }

  const retryResponse =
    await fetch(
      input,
      buildAuthInit(init)
    );

  if (
    retryResponse.status ===
    401
  ) {
    handleExpiredSession();
  }

  return retryResponse;
}