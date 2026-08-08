import { SearchX } from "lucide-react";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import SearchFilters from "@/components/SearchFilters";
import EmptyState from "@/components/EmptyState";

import { getListings } from "@/lib/api";

type TenantPageProps = {
  searchParams: Promise<{
    location?: string;
    min_rent?: string;
    max_rent?: string;
    bedrooms?: string;
    bathrooms?: string;
  }>;
};

export default async function TenantPage({
  searchParams,
}: TenantPageProps) {
  const params = await searchParams;

  const listings = await getListings({
    location:
      params.location || undefined,

    min_rent: params.min_rent
      ? Number(params.min_rent)
      : undefined,

    max_rent: params.max_rent
      ? Number(params.max_rent)
      : undefined,

    bedrooms: params.bedrooms
      ? Number(params.bedrooms)
      : undefined,

    bathrooms: params.bathrooms
      ? Number(params.bathrooms)
      : undefined,
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
            Browse verified rental properties.
          </p>
        </div>

        <SearchFilters />

        <p className="mt-6 text-sm text-gray-600">
          {listings.length} properties available
        </p>

        {listings.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={SearchX}
              title="No properties found"
              description="We couldn’t find any properties matching your current filters. Try adjusting your search or clear the filters to see all available listings."
              actionLabel="Clear Filters"
              actionHref="/tenant"
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}