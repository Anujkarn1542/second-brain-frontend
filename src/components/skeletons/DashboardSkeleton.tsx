import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-7 w-40 mb-2" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <Skeleton className="h-9 w-9 rounded-lg mb-4" />
            <Skeleton className="h-7 w-16 mb-1.5" />
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800">
          <Skeleton className="h-4 w-36 mb-4" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
        <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800">
          <Skeleton className="h-4 w-28 mb-4" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="h-7 w-7 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-3/4 mb-1.5" />
                  <Skeleton className="h-2.5 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
