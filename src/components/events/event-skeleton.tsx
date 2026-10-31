export function EventSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-base-300/80 bg-base-100 shadow-sm animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="aspect-[16/10] w-full bg-base-300/70" />

      {/* Card Content placeholder */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-5 w-4/5 rounded bg-base-300" />
          <div className="h-5 w-2/3 rounded bg-base-300/60" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3.5 w-full rounded bg-base-300/50" />
          <div className="h-3.5 w-5/6 rounded bg-base-300/40" />
        </div>

        {/* Meta details skeleton */}
        <div className="space-y-2 pt-2 border-t border-base-200">
          <div className="h-4 w-1/2 rounded bg-base-300/60" />
          <div className="h-4 w-2/3 rounded bg-base-300/50" />
        </div>

        {/* Volunteers box skeleton */}
        <div className="h-10 w-full rounded-xl bg-base-200" />

        {/* Footer skeleton */}
        <div className="mt-auto pt-3 border-t border-base-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-base-300" />
            <div className="h-3.5 w-24 rounded bg-base-300/70" />
          </div>
          <div className="h-8 w-24 rounded-full bg-base-300" />
        </div>
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <EventSkeleton key={i} />
      ))}
    </div>
  );
}
