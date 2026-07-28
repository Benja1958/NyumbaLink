import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import SearchFilters from "@/components/SearchFilters";
import { getListings } from "@/lib/api";

export default async function TenantPage() {
  const listings = await getListings();

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
          <div className="mt-10 rounded-xl border border-dashed border-gray-300 p-10 text-center">
            <h2 className="text-lg font-semibold">
              No properties available
            </h2>

            <p className="mt-2 text-gray-500">
              Check back soon for new listings.
            </p>
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