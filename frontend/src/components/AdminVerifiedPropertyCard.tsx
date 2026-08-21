"use client";

import {
  BadgeCheck,
  Bath,
  Bed,
  MapPin,
  ShieldCheck,
  ShieldX,
} from "lucide-react";

import { Listing } from "@/types/listing";

import AdminImageGallery from "@/components/AdminImageGallery";

type AdminVerifiedPropertyCardProps = {
  listing: Listing;

  onVerify: (id: number) => void;

  onUnverify: (id: number) => void;

  processing?: boolean;
};

export default function AdminVerifiedPropertyCard({
  listing,
  onVerify,
  onUnverify,
  processing = false,
}: AdminVerifiedPropertyCardProps) {
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

          {listing.is_verified_property ? (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              <BadgeCheck className="h-4 w-4" />
              Verified Property
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              Not Verified
            </span>
          )}
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
            KES{" "}
            {listing.monthly_rent.toLocaleString()}
          </span>

          <span className="text-sm text-gray-500">
            /month
          </span>
        </div>

        {listing.is_verified_property &&
          listing.property_verified_at && (
            <p className="mt-3 text-xs text-gray-500">
              Verified{" "}
              {new Date(
                listing.property_verified_at
              ).toLocaleDateString()}
            </p>
          )}

        <div className="mt-5 border-t pt-4">
          {listing.is_verified_property ? (
            <button
              type="button"
              disabled={processing}
              onClick={() =>
                onUnverify(listing.id)
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <ShieldX className="h-4 w-4" />

              {processing
                ? "Removing..."
                : "Remove Verification"}
            </button>
          ) : (
            <button
              type="button"
              disabled={processing}
              onClick={() =>
                onVerify(listing.id)
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />

              {processing
                ? "Verifying..."
                : "Verify Property"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}