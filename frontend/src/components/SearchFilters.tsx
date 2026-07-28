"use client";

import { Search } from "lucide-react";

export default function SearchFilters() {
  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            County
          </label>

          <select className="w-full rounded-lg border border-gray-300 px-3 py-3">
            <option>All Counties</option>
            <option>Nairobi</option>
            <option>Kiambu</option>
            <option>Mombasa</option>
            <option>Nakuru</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Town
          </label>

          <select className="w-full rounded-lg border border-gray-300 px-3 py-3">
            <option>All Towns</option>
            <option>Westlands</option>
            <option>Kilimani</option>
            <option>Kikuyu</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Bedrooms
          </label>

          <select className="w-full rounded-lg border border-gray-300 px-3 py-3">
            <option>Any</option>
            <option>1+</option>
            <option>2+</option>
            <option>3+</option>
          </select>
        </div>
      </div>

      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Search by location, property name, or amenities..."
          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4"
        />
      </div>
    </section>
  );
}