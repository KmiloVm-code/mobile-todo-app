import { Skeleton } from "../ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-muted/80 backdrop-blur-lg border-b border-muted sticky top-0 z-10 shadow-sm transition-colors duration-300">
        <div className="px-3 sm:px-6 py-3 sm:py-6">
          <div className="flex flex-row items-start sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-8 sm:h-9 w-40 sm:w-52" />
              <Skeleton className="h-4 w-24 sm:w-36 mt-1" />
            </div>
            <div className="flex flex-row items-center gap-2 sm:gap-3 flex-shrink-0 mt-3 sm:mt-0">
              <Skeleton className="h-6 w-20 sm:w-28 rounded-full" />
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      <Skeleton className="h-14 w-full" />
      <div className="grid grid-cols-3 gap-3 rounded-lg border border-muted p-2">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
      <div className="flex items-start gap-4">
        <Skeleton className="h-6 w-6 rounded-full mt-1" />
        <div className="flex-1 min-w-0 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="flex gap-1 justify-end">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardHeaderSkeleton() {
  return (
    <div className="space-y-4 px-3 sm:px-6 py-3 sm:py-6">
      <div className="bg-muted/80 backdrop-blur-lg border-b border-muted sticky top-0 z-10 shadow-sm transition-colors duration-300 p-3">
        <div className="flex flex-row items-start sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-8 sm:h-9 w-40 sm:w-52" />
            <Skeleton className="h-4 w-24 sm:w-36 mt-1" />
          </div>
          <div className="flex flex-row items-center gap-2 sm:gap-3 flex-shrink-0 mt-3 sm:mt-0">
            <Skeleton className="h-6 w-20 sm:w-28 rounded-full" />
            <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-14 w-full" />
      <div className="grid grid-cols-3 gap-3 rounded-lg border border-muted p-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="space-y-4 p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="h-6 w-6 rounded-full mt-1" />
        <div className="flex-1 min-w-0 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="flex gap-1 justify-end">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
