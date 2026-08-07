import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <div className="h-9 w-72 animate-pulse rounded bg-gray-200" />

        <div className="mt-3 h-5 w-60 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="mt-8 h-24 animate-pulse rounded-xl bg-gray-100" />

      <div className="mt-6 h-4 w-40 animate-pulse rounded bg-gray-200" />

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <PropertyCardSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}