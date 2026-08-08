import Link from "next/link";

import {
  Home,
  Search,
} from "lucide-react";

export default function ListingNotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6 py-16">
      <div className="w-full rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Home className="h-8 w-8 text-gray-500" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Property not found
        </h1>

        <p className="mx-auto mt-3 max-w-md text-gray-600">
          This property may have been removed,
          rented, suspended, or is no longer
          available.
        </p>

        <Link
          href="/tenant"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
        >
          <Search className="h-4 w-4" />
          Browse Properties
        </Link>
      </div>
    </main>
  );
}