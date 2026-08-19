"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";

import Link from "next/link";

import { toast } from "sonner";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import {
  loginUser,
  resendVerificationEmailByEmail,
} from "@/lib/auth";

function LoginContent() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const { login } = useAuth();

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    unverifiedEmail,
    setUnverifiedEmail,
  ] = useState("");

  const [
    resending,
    setResending,
  ] = useState(false);

  const sessionExpired =
    searchParams.get("reason") ===
    "session-expired";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setUnverifiedEmail("");
    setLoading(true);

    const formData =
      new FormData(
        event.currentTarget
      );

    const email =
      formData
        .get("email")
        ?.toString() ?? "";

    const password =
      formData
        .get("password")
        ?.toString() ?? "";

    try {
      const data =
        await loginUser({
          email,
          password,
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
      const message =
        error instanceof Error
          ? error.message
          : "Login failed";

      setError(message);

      if (
        message ===
        "Please verify your email before logging in"
      ) {
        setUnverifiedEmail(
          email
        );
      } else {
        setUnverifiedEmail(
          ""
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    if (!unverifiedEmail) {
      return;
    }

    try {
      setResending(true);
      setError("");

      await resendVerificationEmailByEmail(
        unverifiedEmail
      );

      toast.success(
        "Verification email sent. Check your inbox."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to resend verification email"
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
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
          Welcome back to NyumbaLink.
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

          {unverifiedEmail && (
            <button
              type="button"
              onClick={
                handleResendVerification
              }
              disabled={
                resending
              }
              className="text-sm font-medium text-amber-700 underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending
                ? "Sending verification email..."
                : "Resend verification email"}
            </button>
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

function LoginFallback() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-gray-600">
          Loading...
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <LoginFallback />
      }
    >
      <LoginContent />
    </Suspense>
  );
}