"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";

import Link from "next/link";

import {
  useSearchParams,
} from "next/navigation";

import {
  Check,
  MailWarning,
} from "lucide-react";

import PasswordInput from "@/components/PasswordInput";

import {
  resetPassword,
} from "@/lib/auth";

type ResetStatus =
  | "form"
  | "success"
  | "invalid";

function ResetPasswordContent() {
  const searchParams =
    useSearchParams();

  const token =
    searchParams.get("token") ?? "";

  const [status, setStatus] =
    useState<ResetStatus>(
      token ? "form" : "invalid"
    );

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const formData =
      new FormData(
        event.currentTarget
      );

    const newPassword =
      formData
        .get("new_password")
        ?.toString() ?? "";

    const confirmPassword =
      formData
        .get("confirm_password")
        ?.toString() ?? "";

    if (
      newPassword !== confirmPassword
    ) {
      setError(
        "Passwords do not match"
      );

      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        token,
        new_password: newPassword,
        confirm_password:
          confirmPassword,
      });

      setStatus("success");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to reset password";

      if (
        message
          .toLowerCase()
          .includes(
            "invalid or has expired"
          )
      ) {
        setStatus("invalid");

        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {status === "form" && (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Back to login
            </Link>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Reset password
            </h1>

            <p className="mt-2 text-gray-600">
              Choose a new password for
              your KayaHub account. You
              can’t reuse a recent
              password.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-4"
            >
              <PasswordInput
                name="new_password"
                placeholder="New password"
                aria-label="New password"
                required
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
              />

              <PasswordInput
                name="confirm_password"
                placeholder="Confirm new password"
                aria-label="Confirm new password"
                required
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
              />

              {error && (
                <p
                  role="alert"
                  className="text-sm text-red-600"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gray-950 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
              >
                {loading
                  ? "Resetting password..."
                  : "Reset password"}
              </button>
            </form>
          </>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-700 shadow-sm">
              <Check className="h-10 w-10 text-white" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Password reset
            </h1>

            <p
              role="status"
              className="mt-3 text-gray-600"
            >
              Your password has been
              updated. You can now log in
              with your new password.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-gray-950 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Continue to login
            </Link>
          </div>
        )}

        {status === "invalid" && (
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <MailWarning className="h-10 w-10 text-amber-700" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Link invalid or expired
            </h1>

            <p className="mt-3 text-gray-600">
              This password reset link is
              invalid, has expired, or has
              already been used.
            </p>

            <Link
              href="/forgot-password"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-gray-950 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Request a new link
            </Link>

            <Link
              href="/login"
              className="mt-4 inline-flex text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Back to login
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function ResetPasswordFallback() {
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <ResetPasswordFallback />
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
