"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  MailCheck,
} from "lucide-react";

import {
  requestPasswordReset,
} from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

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

    const email =
      formData
        .get("email")
        ?.toString()
        .trim() ?? "";

    try {
      await requestPasswordReset(
        email
      );

      setSubmitted(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send reset link"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <Link
          href="/login"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to login
        </Link>

        {submitted ? (
          <div className="mt-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <MailCheck className="h-7 w-7 text-green-700" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Check your email
            </h1>

            <p
              role="status"
              className="mt-3 leading-7 text-gray-600"
            >
              If an account exists for
              this email, we’ve sent a
              password reset link. The
              link expires in 60 minutes.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Didn’t get it? Check your
              spam folder, or wait a
              minute and try again.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-gray-950 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Forgot password?
            </h1>

            <p className="mt-2 text-gray-600">
              Enter your email and we’ll
              send you a link to reset
              your KayaHub password.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-4"
            >
              <input
                name="email"
                type="email"
                placeholder="Email"
                aria-label="Email"
                required
                autoComplete="email"
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
                  ? "Sending..."
                  : "Send reset link"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
