"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import {
  useRouter,
} from "next/navigation";

import {
  MailCheck,
} from "lucide-react";

import {
  signupUser,
} from "@/lib/auth";

export default function LandlordSignupPage() {
  const router = useRouter();

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    verificationEmail,
    setVerificationEmail,
  ] = useState("");

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
        ?.toString() ?? "";

    const password =
      formData
        .get("password")
        ?.toString() ?? "";

    const confirmPassword =
      formData
        .get("confirm_password")
        ?.toString() ?? "";

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match"
      );

      setLoading(false);
      return;
    }

    try {
      await signupUser({
        full_name:
          formData
            .get("full_name")
            ?.toString() ?? "",

        email,

        phone_number:
          formData
            .get("phone_number")
            ?.toString() ?? "",

        password,

        confirm_password:
          confirmPassword,

        role: "landlord",
      });

      setVerificationEmail(
        email
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  if (verificationEmail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-green-50 px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <MailCheck className="h-7 w-7 text-green-700" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Check your email
          </h1>

          <p className="mt-3 text-gray-600">
            We sent a verification link to
          </p>

          <p className="mt-1 font-medium text-gray-900">
            {verificationEmail}
          </p>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            Verify your email address before
            logging in to your landlord
            account.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/login")
            }
            className="mt-8 w-full rounded-lg bg-green-800 py-3 font-medium text-white transition hover:bg-green-900"
          >
            Continue to Login
          </button>

          <button
            type="button"
            onClick={() =>
              setVerificationEmail("")
            }
            className="mt-4 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Use a different email
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-green-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold">
            Landlord Sign Up
          </h1>

          <p className="mt-2 text-gray-600">
            Create your account to list
            and manage properties.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              name="full_name"
              type="text"
              placeholder="John Kamau"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>

            <input
              name="phone_number"
              type="tel"
              placeholder="+254712345678"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <input
              name="confirm_password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-950 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : "Create Landlord Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}