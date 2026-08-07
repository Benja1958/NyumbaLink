export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section>
          <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-gray-200" />

          <div className="mt-6 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />

              <div className="mt-3 h-5 w-40 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="h-11 w-11 animate-pulse rounded-xl bg-gray-200" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-gray-200 bg-white p-6">
            <div className="h-8 w-44 animate-pulse rounded bg-gray-200" />

            <div className="flex gap-6">
              <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
              <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />

            <div className="mt-4 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            <div className="h-6 w-28 animate-pulse rounded bg-gray-200" />

            <div className="mt-4 flex flex-wrap gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-24 animate-pulse rounded-full bg-gray-200"
                />
              ))}
            </div>
          </div>
        </section>

        <aside>
          <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-gray-200" />

            <div className="mt-6 h-12 w-full animate-pulse rounded-xl bg-gray-200" />

            <div className="mt-5 h-px w-full bg-gray-200" />

            <div className="mt-5 h-5 w-28 animate-pulse rounded bg-gray-200" />
          </div>
        </aside>
      </div>
    </main>
  );
}