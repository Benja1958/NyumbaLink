export default function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="aspect-[4/3] w-full animate-pulse bg-gray-200" />

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="flex gap-4">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />

        <div className="flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-gray-200" />

          <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />

          <div className="h-7 w-16 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}