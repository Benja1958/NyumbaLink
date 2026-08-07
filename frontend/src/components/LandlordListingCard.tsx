"use client";

import Link from "next/link";

import {
  Bath,
  Bed,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";

import { Listing } from "@/types/listing";

type LandlordListingCardProps = {
  listing: Listing;
  onDelete: (id: number) => void;
  onConfirmAvailability: (id: number) => void;
  onMarkRented: (id: number) => void;
  deleting?: boolean;
  availabilityUpdating?: boolean;
};

export default function LandlordListingCard({
  listing,
  onDelete,
  onConfirmAvailability,
  onMarkRented,
  deleting = false,
  availabilityUpdating = false,
}: LandlordListingCardProps) {
  const coverImage =
    listing.images?.find(
      (image) => image.is_cover
    )?.image_url ??
    listing.images?.[0]?.image_url ??
    listing.image_url;

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <img
        src={coverImage ?? ""}
        alt={listing.title}
        className="aspect-[4/3] w-full bg-gray-100 object-cover object-center"
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900">
              {listing.title}
            </h2>

            <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-4 w-4 shrink-0" />

              <span className="truncate">
                {listing.location}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            {listing.approval_status ===
              "approved" && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Approved
              </span>
            )}

            {listing.approval_status ===
              "pending" && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                Pending
              </span>
            )}

            {listing.approval_status ===
              "rejected" && (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                Rejected
              </span>
            )}

            {listing.approval_status ===
              "suspended" && (
              <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                Suspended
              </span>
            )}

            {listing.is_available ? (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                Available
              </span>
            ) : (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                Unavailable
              </span>
            )}
          </div>
        </div>

        {listing.approval_status ===
          "rejected" &&
          listing.rejection_reason && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <span className="font-medium">
                Rejection reason:
              </span>{" "}
              {listing.rejection_reason}
            </div>
          )}

        <div className="mt-4 flex gap-5 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {listing.bedrooms} Beds
          </span>

          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {listing.bathrooms} Baths
          </span>
        </div>

        <div className="mt-4">
          <span className="text-xl font-bold text-green-800">
            KES{" "}
            {listing.monthly_rent.toLocaleString()}
          </span>

          <span className="text-sm text-gray-500">
            /month
          </span>
        </div>

        {listing.approval_status ===
          "approved" && (
            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">
                Availability
              </p>

              {listing.last_availability_confirmed_at ? (
                <p className="mt-1 text-xs text-gray-500">
                  Last confirmed{" "}
                  {formatAvailabilityTime(
                    listing.last_availability_confirmed_at
                  )}
                </p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Availability has not been confirmed yet.
                </p>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onConfirmAvailability(
                      listing.id
                    )
                  }
                  disabled={
                    availabilityUpdating ||
                    !listing.is_available
                  }
                  className="flex-1 rounded-lg bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {availabilityUpdating
                    ? "Updating..."
                    : "Still Available"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onMarkRented(listing.id)
                  }
                  disabled={
                    availabilityUpdating ||
                    !listing.is_available
                  }
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {availabilityUpdating
                    ? "Updating..."
                    : listing.is_available
                    ? "Mark as Rented"
                    : "Rented"}
                </button>
              </div>
            </div>
          )}

        <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
          <Link
            href={`/landlord/listings/${listing.id}/edit`}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>

          <button
            type="button"
            disabled={deleting}
            onClick={() =>
              onDelete(listing.id)
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />

            {deleting
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}

function formatAvailabilityTime(
  value: string
): string {
  const date = new Date(value);
  const now = new Date();

  const differenceInMs =
    now.getTime() - date.getTime();

  const differenceInDays = Math.floor(
    differenceInMs /
      (1000 * 60 * 60 * 24)
  );

  if (differenceInDays <= 0) {
    return "today";
  }

  if (differenceInDays === 1) {
    return "yesterday";
  }

  if (differenceInDays < 7) {
    return `${differenceInDays} days ago`;
  }

  const weeks = Math.floor(
    differenceInDays / 7
  );

  if (weeks === 1) {
    return "1 week ago";
  }

  return `${weeks} weeks ago`;
}