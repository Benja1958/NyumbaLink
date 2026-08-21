import Link from "next/link";

import {
  BadgeCheck,
  Building2,
  CalendarDays,
  MailCheck,
  UserRound,
} from "lucide-react";

import Navbar from "@/components/Navbar";

import {
  getLandlordProfile,
} from "@/lib/landlordProfile";

type LandlordProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LandlordProfilePage({
  params,
}: LandlordProfilePageProps) {
  const { id } = await params;

  const landlordId =
    Number(id);

  const profile =
    await getLandlordProfile(
      landlordId
    );

  const memberSince =
    new Intl.DateTimeFormat(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    ).format(
      new Date(
        profile.created_at
      )
    );

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href="/tenant"
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to properties
        </Link>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {profile.profile_image_url ? (
              <img
                src={
                  profile.profile_image_url
                }
                alt={
                  profile.full_name
                }
                className="h-28 w-28 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-green-100">
                <UserRound className="h-12 w-12 text-green-800" />
              </div>
            )}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.full_name}
                </h1>

                {profile.is_verified_landlord && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                    <BadgeCheck className="h-4 w-4" />
                    Verified Landlord
                  </span>
                )}

              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">

                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Member since{" "}
                  {memberSince}
                </span>

                {profile.email_verified && (
                  <span className="inline-flex items-center gap-2 text-green-700">
                    <MailCheck className="h-4 w-4" />
                    Email verified
                  </span>
                )}

              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <Building2 className="h-5 w-5 text-gray-500" />

            <p className="mt-4 text-2xl font-bold text-gray-900">
              {
                profile.approved_listings_count
              }
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Approved Listings
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <BadgeCheck className="h-5 w-5 text-gray-500" />

            <p className="mt-4 text-lg font-semibold text-gray-900">
              {profile.is_verified_landlord
                ? "Verified"
                : "Not verified"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Landlord Status
            </p>
          </div>

        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900">
            About
          </h2>

          {profile.about ? (
            <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
              {profile.about}
            </p>
          ) : (
            <p className="mt-4 text-gray-500">
              This landlord has not added
              an introduction yet.
            </p>
          )}
        </section>
      </main>
    </>
  );
}