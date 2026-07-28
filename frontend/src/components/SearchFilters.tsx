"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent } from "react";

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const location = formData.get("location")?.toString().trim();
    const minRent = formData.get("min_rent")?.toString();
    const maxRent = formData.get("max_rent")?.toString();
    const bedrooms = formData.get("bedrooms")?.toString();
    const bathrooms = formData.get("bathrooms")?.toString();

    if (location) {
      params.set("location", location);
    }

    if (minRent) {
      params.set("min_rent", minRent);
    }

    if (maxRent) {
      params.set("max_rent", maxRent);
    }

    if (bedrooms) {
      params.set("bedrooms", bedrooms);
    }

    if (bathrooms) {
      params.set("bathrooms", bathrooms);
    }

    router.push(`/tenant?${params.toString()}`);
  }

  function clearFilters() {
    router.push("/tenant");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-xl border border-gray-200 bg-white p-5"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Location
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              name="location"
              type="text"
              placeholder="Westlands..."
              defaultValue={searchParams.get("location") ?? ""}
              className="w-full rounded-lg border border-gray-300 py-3 pl-9 pr-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Minimum Rent
          </label>

          <input
            name="min_rent"
            type="number"
            min="0"
            placeholder="10000"
            defaultValue={searchParams.get("min_rent") ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Maximum Rent
          </label>

          <input
            name="max_rent"
            type="number"
            min="0"
            placeholder="50000"
            defaultValue={searchParams.get("max_rent") ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Bedrooms
          </label>

          <select
            name="bedrooms"
            defaultValue={searchParams.get("bedrooms") ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-3"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Bathrooms
          </label>

          <select
            name="bathrooms"
            defaultValue={searchParams.get("bathrooms") ?? ""}
            className="w-full rounded-lg border border-gray-300 px-3 py-3"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          className="rounded-lg bg-gray-950 px-6 py-3 font-medium text-white hover:bg-gray-800"
        >
          Search Properties
        </button>

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </form>
  );
}