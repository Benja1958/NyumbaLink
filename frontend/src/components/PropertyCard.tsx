"use client";

import Link from "next/link";
import { Bath, Bed, Heart, MapPin } from "lucide-react";

import { Listing } from "@/types/listing";
import FavoriteButton from "@/components/FavoriteButton";

type PropertyCardProps = {
  property: Listing;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link
      href={`/listings/${property.id}`}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative">
        <img
          src={property.image_url}
          alt={property.title}
          className="h-52 w-full object-cover"
        />

        <div
          className="absolute right-3 top-3"
          onClick={(event) => event.preventDefault()}
        >
          <FavoriteButton listingId={property.id} />
        </div>
      </div>

      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          {property.title}
        </h2>

        <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          {property.location}
        </div>

        <p className="mt-3 text-sm text-gray-600">{property.description}</p>

        <div className="mt-4 flex gap-5 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {property.bedrooms} Beds
          </div>

          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.bathrooms} Baths
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {property.amenities.map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-5 border-t border-gray-100 pt-4">
          <span className="text-xl font-bold text-indigo-600">
            KES {property.monthly_rent.toLocaleString()}
          </span>

          <span className="text-sm text-gray-500">/month</span>
        </div>
      </div>
    </Link>
  );
}
