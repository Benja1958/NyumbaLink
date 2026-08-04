"use client";

import Link from "next/link";
import { Bath, Bed, MapPin, Pencil, Trash2 } from "lucide-react";

import { Listing } from "@/types/listing";

type LandlordListingCardProps = {
  listing: Listing;
  onDelete: (id: number) => void;
  deleting?: boolean;
};

export default function LandlordListingCard({
  listing,
  onDelete,
  deleting = false,
}: LandlordListingCardProps) {
  const approvalStatus =
    listing.approval_status ?? (listing.is_approved ? "approved" : "pending");

  const approvalLabel =
    approvalStatus === "approved"
      ? "Approved"
      : approvalStatus === "rejected"
        ? "Rejected"
        : "Pending";

  const approvalClasses =
    approvalStatus === "approved"
      ? "bg-green-100 text-green-700"
      : approvalStatus === "rejected"
        ? "bg-red-100 text-red-700"
        : "bg-amber-100 text-amber-700";

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
              <span className="truncate">{listing.location}</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${approvalClasses}`}
            >
              {approvalLabel}
            </span>

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
            KES {listing.monthly_rent.toLocaleString()}
          </span>

          <span className="text-sm text-gray-500">/month</span>
        </div>

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
            onClick={() => onDelete(listing.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
