"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Check,
  MailWarning,
} from "lucide-react";

import {
  useSearchParams,
} from "next/navigation";

import {
  toast,
} from "sonner";

import {
  resendVerificationEmailByEmail,
  verifyEmail,
} from "@/lib/auth";

type VerificationStatus =
  | "verifying"
  | "success"
  | "expired"
  | "error";

function VerifyEmailContent() {
  const searchParams =
    useSearchParams();

  const token =
    searchParams.get("token");

  const email =
    searchParams.get("email") ?? "";

  const [status, setStatus] =
    useState<VerificationStatus>(
      "verifying"
    );

  const [message, setMessage] =
    useState(
      "We’re verifying your email address."
    );

  const [
    resending,
    setResending,
  ] = useState(false);

  useEffect(() => {
    async function verifyCurrentEmail() {
      if (!token) {
        setStatus("error");
        setMessage(
          "This verification link is invalid."
        );

        return;
      }

      try {
        await verifyEmail(token);

        setStatus("success");

        setMessage(
          "Your email address has been verified successfully."
        );
      } catch (error) {
        const detail =
          error instanceof Error
            ? error.message
            : "Email verification failed.";

        if (
          detail
            .toLowerCase()
            .includes("expired")
        ) {
          setStatus("expired");
          setMessage(
            "This verification link has expired."
          );

          return;
        }

        setStatus("error");

        setMessage(
          detail
        );
      }
    }

    verifyCurrentEmail();
  }, [token]);

  async function handleResend() {
    if (!email) {
      toast.error(
        "We couldn’t determine which email to resend the verification to."
      );

      return;
    }

    try {
      setResending(true);

      await resendVerificationEmailByEmail(
        email
      );

      toast.success(
        "A new verification email has been sent."
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to resend verification email."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-8 text-center shadow-sm">

        {status === "verifying" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Verifying email
            </h1>

            <p className="mt-3 text-gray-600">
              {message}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-700 shadow-sm">
              <Check className="h-10 w-10 text-white" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Email verified!
            </h1>

            <p className="mt-3 text-gray-600">
              {message}
            </p>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-xl bg-green-800 px-5 py-3 font-medium text-white transition hover:bg-green-900"
              >
                Continue to Login
              </Link>
            </div>
          </>
        )}

        {status === "expired" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
              <MailWarning className="h-10 w-10 text-amber-700" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Link expired
            </h1>

            <p className="mt-3 text-gray-600">
              {message}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Request a new verification
              email and try again.
            </p>

            <button
              type="button"
              onClick={
                handleResend
              }
              disabled={
                resending
              }
              className="mt-6 text-sm font-semibold text-green-800 underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending
                ? "Sending..."
                : "Resend verification email"}
            </button>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Back to login
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <MailWarning className="h-10 w-10 text-red-600" />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Verification failed
            </h1>

            <p className="mt-3 text-gray-600">
              {message}
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex text-sm font-medium text-gray-700 underline underline-offset-4"
            >
              Back to login
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

function VerifyEmailFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-green-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Loading
        </h1>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <VerifyEmailFallback />
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
