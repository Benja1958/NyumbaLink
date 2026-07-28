"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { signupUser } from "@/lib/auth";

export default function TenantSignupPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const password = formData
      .get("password")
      ?.toString() ?? "";

    const confirmPassword = formData
      .get("confirm_password")
      ?.toString() ?? "";

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await signupUser({
        full_name:
          formData.get("full_name")?.toString() ?? "",
        email:
          formData.get("email")?.toString() ?? "",
        phone_number:
          formData.get("phone_number")?.toString() ?? "",
        password,
        confirm_password: confirmPassword,
        role: "tenant",
      });

      router.push("/login");
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-indigo-50 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <Link
          href="/"
          className="text-sm text-gray-600"
        >
          ← Back
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Tenant Sign Up
        </h1>

        <p className="mt-2 text-gray-600">
          Create your account to start browsing homes.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >
          <input
            name="full_name"
            type="text"
            placeholder="Full name"
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            name="phone_number"
            type="tel"
            placeholder="+254712345678"
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

          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm password"
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
            {loading
              ? "Creating account..."
              : "Create Account"}
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