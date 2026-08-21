"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  BadgeCheck,
  Building2,
  CalendarDays,
  MailCheck,
  ShieldCheck,
  ShieldOff,
  UserRound,
} from "lucide-react";

import {
  AdminLandlord,
  getAdminLandlords,
  unverifyLandlord,
  verifyLandlord,
} from "@/lib/admin";

export default function AdminLandlordsPage() {
  const [landlords, setLandlords] =
    useState<AdminLandlord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    updatingLandlordId,
    setUpdatingLandlordId,
  ] = useState<number | null>(
    null
  );

  useEffect(() => {
    loadLandlords();
  }, []);

  async function loadLandlords() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAdminLandlords();

      setLandlords(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load landlords"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(
    landlord: AdminLandlord
  ) {
    try {
      setUpdatingLandlordId(
        landlord.id
      );

      setError("");

      await verifyLandlord(
        landlord.id
      );

      setLandlords(
        (current) =>
          current.map((item) =>
            item.id === landlord.id
              ? {
                  ...item,
                  is_verified_landlord:
                    true,
                }
              : item
          )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to verify landlord"
      );
    } finally {
      setUpdatingLandlordId(
        null
      );
    }
  }

  async function handleUnverify(
    landlord: AdminLandlord
  ) {
    try {
      setUpdatingLandlordId(
        landlord.id
      );

      setError("");

      await unverifyLandlord(
        landlord.id
      );

      setLandlords(
        (current) =>
          current.map((item) =>
            item.id === landlord.id
              ? {
                  ...item,
                  is_verified_landlord:
                    false,
                }
              : item
          )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove verification"
      );
    } finally {
      setUpdatingLandlordId(
        null
      );
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-gray-600">
          Loading landlords...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">

      <div className="flex flex-wrap items-start justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Landlords
          </h1>

          <p className="mt-2 text-gray-600">
            Review landlord accounts
            and manage verification.
          </p>
        </div>

        <Link
          href="/admin"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to admin
        </Link>

      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-4">

        {landlords.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <UserRound className="mx-auto h-10 w-10 text-gray-400" />

            <h2 className="mt-4 font-semibold text-gray-900">
              No landlords found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Landlord accounts will
              appear here.
            </p>
          </div>
        ) : (
          landlords.map(
            (landlord) => {
              const isUpdating =
                updatingLandlordId ===
                landlord.id;

              const memberSince =
                new Intl.DateTimeFormat(
                  "en-US",
                  {
                    month: "short",
                    year: "numeric",
                  }
                ).format(
                  new Date(
                    landlord.created_at
                  )
                );

              return (
                <div
                  key={landlord.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex min-w-0 items-start gap-4">

                      {landlord.profile_image_url ? (
                        <img
                          src={
                            landlord.profile_image_url
                          }
                          alt={
                            landlord.full_name
                          }
                          className="h-16 w-16 shrink-0 rounded-full border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100">
                          <UserRound className="h-8 w-8 text-green-800" />
                        </div>
                      )}

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h2 className="text-lg font-semibold text-gray-900">
                            {
                              landlord.full_name
                            }
                          </h2>

                          {landlord.is_verified_landlord && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                              <BadgeCheck className="h-4 w-4" />
                              Verified Landlord
                            </span>
                          )}

                        </div>

                        <p className="mt-1 break-all text-sm text-gray-600">
                          {
                            landlord.email
                          }
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">

                          <span
                            className={
                              landlord.email_verified
                                ? "inline-flex items-center gap-1.5 text-green-700"
                                : "inline-flex items-center gap-1.5 text-gray-500"
                            }
                          >
                            <MailCheck className="h-4 w-4" />

                            {landlord.email_verified
                              ? "Email verified"
                              : "Email not verified"}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Building2 className="h-4 w-4" />

                            {
                              landlord.approved_listings_count
                            }{" "}
                            approved{" "}
                            {landlord.approved_listings_count ===
                            1
                              ? "listing"
                              : "listings"}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4" />
                            Joined{" "}
                            {
                              memberSince
                            }
                          </span>

                        </div>

                      </div>

                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">

                      <Link
                        href={`/landlords/${landlord.id}`}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        View Profile
                      </Link>

                      {landlord.is_verified_landlord ? (
                        <button
                          type="button"
                          disabled={
                            isUpdating
                          }
                          onClick={() =>
                            handleUnverify(
                              landlord
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <ShieldOff className="h-4 w-4" />

                          {isUpdating
                            ? "Updating..."
                            : "Remove Verification"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            !landlord.email_verified
                          }
                          onClick={() =>
                            handleVerify(
                              landlord
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                          title={
                            !landlord.email_verified
                              ? "Email must be verified first"
                              : undefined
                          }
                        >
                          <ShieldCheck className="h-4 w-4" />

                          {isUpdating
                            ? "Verifying..."
                            : "Verify Landlord"}
                        </button>
                      )}

                    </div>

                  </div>

                  {!landlord.email_verified &&
                    !landlord.is_verified_landlord && (
                      <div className="mt-5 border-t border-gray-100 pt-4">
                        <p className="text-sm text-amber-700">
                          This landlord
                          cannot be verified
                          until their email
                          address is verified.
                        </p>
                      </div>
                    )}

                </div>
              );
            }
          )
        )}

      </div>

    </main>
  );
}