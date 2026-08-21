import { authFetch } from "@/lib/authFetch";

export type UserRole =
  | "tenant"
  | "landlord"
  | "admin";

export type User = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  created_at: string;
  email_verified: boolean;
  email_verified_at: string | null;
};

export type SignupPayload = {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  role: "tenant" | "landlord";
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

type ValidationError = {
  msg: string;
};

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const data = await response.json();

    if (
      typeof data.detail === "string"
    ) {
      return data.detail;
    }

    if (
      Array.isArray(data.detail)
    ) {
      return data.detail
        .map(
          (item: ValidationError) =>
            item.msg
        )
        .join(", ");
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export async function signupUser(
  payload: SignupPayload
): Promise<User> {
  const response = await fetch(
    "/backend-api/auth/signup",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const message =
      await getErrorMessage(
        response,
        "Failed to create account"
      );

    throw new Error(message);
  }

  return response.json();
}


export async function resendVerificationEmail(): Promise<{
  message: string;
}> {
  const response = await authFetch(
    "/backend-api/auth/email-verification/send",
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Failed to send verification email"
    );
  }

  return data;
}

export async function resendVerificationEmailByEmail(
  email: string
): Promise<{
  message: string;
}> {
  const response = await fetch(
    "/backend-api/auth/email-verification/resend",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Failed to send verification email"
    );
  }

  return data;
}

export async function verifyEmail(
  token: string
): Promise<{
  message: string;
}> {
  const response = await fetch(
    "/backend-api/auth/email-verification/verify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Email verification failed."
    );
  }

  return data;
}


export async function loginUser(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await fetch(
    "/backend-api/auth/login",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const message =
      await getErrorMessage(
        response,
        "Failed to login"
      );

    throw new Error(message);
  }

  return response.json();
}

export async function getCurrentUser(): Promise<User> {
  const response = await authFetch(
    "/backend-api/auth/me"
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    throw new Error(
      "Failed to fetch current user"
    );
  }

  return response.json();
}

export async function logoutUser(): Promise<void> {
  const response = await authFetch(
    "/backend-api/auth/logout",
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to log out"
    );
  }
}
