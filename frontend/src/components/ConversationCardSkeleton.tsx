export default function ConversationCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="h-24 w-28 shrink-0 animate-pulse rounded-xl bg-gray-200" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />

            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />

            <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
        </div>

        <div className="mt-3 h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}