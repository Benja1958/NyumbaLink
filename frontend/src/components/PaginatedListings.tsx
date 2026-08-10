"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import PropertyCard from "@/components/PropertyCard";

import {
  getListings,
  ListingFilters,
} from "@/lib/api";

import { Listing } from "@/types/listing";

type PaginatedListingsProps = {
  initialListings: Listing[];
  filters: ListingFilters;
};

const PAGE_SIZE = 20;

export default function PaginatedListings({
  initialListings,
  filters,
}: PaginatedListingsProps) {
  const [listings, setListings] =
    useState<Listing[]>(
      initialListings
    );

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(
      initialListings.length ===
        PAGE_SIZE
    );

  async function handleLoadMore() {
    if (
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    try {
      setLoadingMore(true);

      const nextListings =
        await getListings({
          ...filters,
          skip: listings.length,
          limit: PAGE_SIZE,
        });

      setListings((current) => [
        ...current,
        ...nextListings,
      ]);

      if (
        nextListings.length <
        PAGE_SIZE
      ) {
        setHasMore(false);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load more properties"
      );
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <>
      <p className="mt-6 text-sm text-gray-600">
        {listings.length}{" "}
        {listings.length === 1
          ? "property"
          : "properties"}{" "}
        loaded
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map(
          (property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          )
        )}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={
              handleLoadMore
            }
            disabled={
              loadingMore
            }
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-800 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-60"
          >
            {loadingMore && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {loadingMore
              ? "Loading..."
              : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}