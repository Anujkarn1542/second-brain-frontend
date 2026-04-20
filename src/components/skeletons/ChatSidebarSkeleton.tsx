import { Skeleton } from "@/components/ui/Skeleton";

export default function ChatSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Tab switcher */}
      <Skeleton className="h-9 w-full rounded-lg" />

      {/* Drop zone */}
      <Skeleton className="h-32 w-full rounded-xl" />

      {/* Document list */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24 mb-1" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800"
          >
            <Skeleton className="w-8 h-8 rounded flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-3 w-3/4 mb-2" />
              <Skeleton className="h-2.5 w-1/3 mb-2" />
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
