"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const data = await loginUser({
        email:
          formData.get("email")?.toString() ?? "",
        password:
          formData.get("password")?.toString() ?? "",
      });

        login(data.access_token, data.user);

      if (data.user.role === "admin") {
        router.push("/admin");
      } else if (data.user.role === "landlord") {
        router.push("/landlord");
      } else {
        router.push("/tenant");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-indigo-50 px-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <Link
          href="/"
          className="text-sm text-gray-600"
        >
          ← Back
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Login
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome back to NyumbaLink.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-950 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}