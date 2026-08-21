import Link from "next/link";
import { notFound } from "next/navigation";

import {
  BadgeCheck,
  Bath,
  Bed,
  CheckCircle2,
  MapPin,
  UserRound,
} from "lucide-react";

import PropertyImageGallery from "@/components/PropertyImageGallery";
import MessageLandlordButton from "@/components/MessageLandlordButton";
import FavoriteButton from "@/components/FavoriteButton";
import ReportListingButton from "@/components/ReportListingButton";

import { getListing } from "@/lib/api";
import {
  getLandlordProfile,
} from "@/lib/landlordProfile";

type ListingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ListingPage({
  params,
}: ListingPageProps) {
  const { id } = await params;

  let property;

  try {
    property =
      await getListing(
        Number(id)
      );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(
        "404"
      )
    ) {
      notFound();
    }

    throw error;
  }

  const approvalStatus =
    property.approval_status ??
    (
      property.is_approved
        ? "approved"
        : "pending"
    );

  const landlord =
    await getLandlordProfile(
      property.landlord_id
    );

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">

      <Link
        href="/tenant"
        className="text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        ← Back to listings
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">

        <section>

          <PropertyImageGallery
            images={
              property.images ??
              []
            }
            fallbackImage={
              property.image_url
            }
            title={
              property.title
            }
          />

          <div className="mt-6 flex items-start justify-between gap-4">

            <div>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-3xl font-bold text-gray-900">
                  {property.title}
                </h1>

                {approvalStatus ===
                  "approved" && (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </span>
                )}

              </div>

              <div className="mt-3 flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />

                {property.location}
              </div>

            </div>

            <FavoriteButton
              listingId={
                property.id
              }
            />

          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-gray-200 bg-white p-6">

            <div>
              <span className="text-3xl font-bold text-indigo-600">
                KES{" "}
                {property.monthly_rent.toLocaleString()}
              </span>

              <span className="text-gray-500">
                /month
              </span>
            </div>

            <div className="flex gap-6">

              <div className="flex items-center gap-2 text-gray-700">
                <Bed className="h-5 w-5" />

                {property.bedrooms} Bedrooms
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Bath className="h-5 w-5" />

                {property.bathrooms} Bathrooms
              </div>

            </div>

          </div>

          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">

            <p className="font-medium text-green-900">
              {property.is_available
                ? "Available"
                : "Currently unavailable"}
            </p>

            {property.is_available &&
              property.last_availability_confirmed_at && (
                <p className="mt-1 text-sm text-green-700">
                  Availability confirmed{" "}
                  {formatAvailabilityTime(
                    property.last_availability_confirmed_at
                  )}
                </p>
              )}

            {property.is_available &&
              !property.last_availability_confirmed_at && (
                <p className="mt-1 text-sm text-gray-600">
                  Availability has not
                  been confirmed recently.
                </p>
              )}

          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

            <h2 className="text-xl font-semibold">
              Description
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              {property.description}
            </p>

          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

            <h2 className="text-xl font-semibold">
              Amenities
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">

              {[
                ...new Set(
                  property.amenities
                ),
              ].map(
                (
                  amenity
                ) => (
                  <span
                    key={
                      amenity
                    }
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700"
                  >
                    {amenity}
                  </span>
                )
              )}

            </div>

          </div>

        </section>


        <aside>

          {/* Landlord card */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">

            <p className="text-sm font-medium text-gray-500">
              Listed by
            </p>

            <div className="mt-4 flex items-center gap-4">

              {landlord.profile_image_url ? (
                <img
                  src={
                    landlord.profile_image_url
                  }
                  alt={
                    landlord.full_name
                  }
                  className="h-14 w-14 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <UserRound className="h-7 w-7 text-green-800" />
                </div>
              )}

              <div className="min-w-0">

                <p className="font-semibold text-gray-900">
                  {landlord.full_name}
                </p>

                <div className="mt-1 flex flex-wrap items-center gap-2">

                  {landlord.is_verified_landlord && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                      <BadgeCheck className="h-4 w-4" />
                      Verified Landlord
                    </span>
                  )}

                  {landlord.email_verified && (
                    <span className="text-xs text-green-700">
                      Email verified
                    </span>
                  )}

                </div>

              </div>

            </div>

            <Link
              href={`/landlords/${landlord.id}`}
              className="mt-5 inline-flex text-sm font-semibold text-green-800 hover:text-green-900"
            >
              View landlord profile →
            </Link>

          </div>


          {/* Contact card */}
          <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6">

            <h2 className="text-lg font-semibold">
              Interested in this property?
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Start a conversation with
              the landlord to ask
              questions or arrange a
              viewing.
            </p>

            <div className="mt-6">
              <MessageLandlordButton
                listingId={
                  property.id
                }
              />
            </div>

            <div className="mt-5 border-t border-gray-200 pt-5">
              <ReportListingButton
                listingId={
                  property.id
                }
              />
            </div>

          </div>

        </aside>

      </div>

    </main>
  );
}


function formatAvailabilityTime(
  value: string
): string {
  const date =
    new Date(value);

  const now =
    new Date();

  const differenceInMs =
    now.getTime() -
    date.getTime();

  const differenceInDays =
    Math.floor(
      differenceInMs /
        (
          1000 *
          60 *
          60 *
          24
        )
    );

  if (
    differenceInDays <=
    0
  ) {
    return "today";
  }

  if (
    differenceInDays ===
    1
  ) {
    return "yesterday";
  }

  if (
    differenceInDays <
    7
  ) {
    return `${differenceInDays} days ago`;
  }

  const weeks =
    Math.floor(
      differenceInDays /
        7
    );

  if (
    weeks ===
    1
  ) {
    return "1 week ago";
  }

  return `${weeks} weeks ago`;
}