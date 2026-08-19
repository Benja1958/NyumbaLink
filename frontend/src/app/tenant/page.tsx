import Navbar from "@/components/Navbar";
import SearchFilters from "@/components/SearchFilters";
import EmptyState from "@/components/EmptyState";
import PaginatedListings from "@/components/PaginatedListings";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";

import {
  Home,
} from "lucide-react";

import {
  getListings,
  ListingFilters,
} from "@/lib/api";

type TenantPageProps = {
  searchParams: Promise<{
    location?: string;
    min_rent?: string;
    max_rent?: string;
    bedrooms?: string;
    bathrooms?: string;
  }>;
};

const PAGE_SIZE = 20;

export default async function TenantPage({
  searchParams,
}: TenantPageProps) {
  const params =
    await searchParams;

  const filters: ListingFilters = {
    location:
      params.location ||
      undefined,

    min_rent:
      params.min_rent
        ? Number(
            params.min_rent
          )
        : undefined,

    max_rent:
      params.max_rent
        ? Number(
            params.max_rent
          )
        : undefined,

    bedrooms:
      params.bedrooms
        ? Number(
            params.bedrooms
          )
        : undefined,

    bathrooms:
      params.bathrooms
        ? Number(
            params.bathrooms
          )
        : undefined,
  };

  const listings =
    await getListings({
      ...filters,
      skip: 0,
      limit: PAGE_SIZE,
    });

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Find your next home
          </h1>

          <p className="mt-2 text-gray-600">
            Browse verified rental
            properties.
          </p>
        </div>

        <EmailVerificationBanner />

        <SearchFilters />

        {listings.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Home}
              title="No properties found"
              description="We couldn't find properties matching your search. Try adjusting your filters."
            />
          </div>
        ) : (
          <PaginatedListings
            initialListings={
              listings
            }
            filters={filters}
          />
        )}
      </main>
    </>
  );
}