"use client";

import { Bath, Bed, Check, MapPin, X } from "lucide-react";

import { Listing } from "@/types/listing";

import AdminImageGallery from "@/components/AdminImageGallery";

type AdminListingCardProps = {
  listing: Listing;

  onApprove: (id: number) => void;

  onReject: (id: number) => void;

  processing?: boolean;
};

export default function AdminListingCard({
  listing,
  onApprove,
  onReject,
  processing = false,
}: AdminListingCardProps) {
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

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <AdminImageGallery
        images={listing.images ?? []}
        fallbackImage={listing.image_url}
        title={listing.title}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {listing.title}
            </h2>

            <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />

              {listing.location}
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${approvalClasses}`}
          >
            {approvalLabel}
          </span>
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

        <p className="mt-4 line-clamp-3 text-sm text-gray-600">
          {listing.description}
        </p>

        <div className="mt-4">
          <span className="text-xl font-bold text-gray-900">
            KES {listing.monthly_rent.toLocaleString()}
          </span>

          <span className="text-sm text-gray-500">/month</span>
        </div>

        <div className="mt-5 flex gap-3 border-t pt-4">
          <button
            type="button"
            disabled={processing}
            onClick={() => onApprove(listing.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Approve
          </button>

          <button
            type="button"
            disabled={processing}
            onClick={() => onReject(listing.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Reject
          </button>
        </div>
      </div>
    </article>
  );
}
