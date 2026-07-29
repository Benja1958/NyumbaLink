const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

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

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item: ValidationError) => item.msg)
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
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
  const message = await getErrorMessage(
    response,
    "Failed to create account"
  );

  throw new Error(message);
}

  return response.json();
}

export async function loginUser(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.detail || "Failed to login"
    );
  }

  return response.json();
}

export async function getCurrentUser(
  token: string
): Promise<User> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
}