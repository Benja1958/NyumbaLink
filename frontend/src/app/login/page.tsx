"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const { login } = useAuth();

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const sessionExpired =
    searchParams.get("reason") ===
    "session-expired";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const formData =
      new FormData(
        event.currentTarget
      );

    try {
      const data =
        await loginUser({
          email:
            formData
              .get("email")
              ?.toString() ?? "",

          password:
            formData
              .get("password")
              ?.toString() ?? "",
        });

      login(data.user);

      if (
        data.user.role ===
        "admin"
      ) {
        router.push("/admin");
      } else if (
        data.user.role ===
        "landlord"
      ) {
        router.push(
          "/landlord"
        );
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
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <Link
          href="/"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Login
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome back to
          NyumbaLink.
        </p>

        {sessionExpired && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Session expired
                </p>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Your session has
                  expired. Please log
                  in again to continue.
                </p>
              </div>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-950 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}