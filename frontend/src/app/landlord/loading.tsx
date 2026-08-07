export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="h-11 w-40 animate-pulse rounded-xl bg-gray-200" />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <LandlordListingSkeleton
              key={index}
            />
          )
        )}
      </div>
    </main>
  );
}

function LandlordListingSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Property image */}
      <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />

      <div className="p-5">
        {/* Title + status */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

            <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />

            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>

        {/* Beds + baths */}
        <div className="mt-4 flex gap-5">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Rent */}
        <div className="mt-4 h-6 w-36 animate-pulse rounded bg-gray-200" />

        {/* Availability */}
        <div className="mt-4 rounded-xl bg-gray-50 p-4">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

          <div className="mt-2 h-3 w-36 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 flex gap-2">
            <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-200" />

            <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>

        {/* Edit / Delete */}
        <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
          <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />

          <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}