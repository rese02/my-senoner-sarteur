
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-5 items-start">
        {/* Recent Orders Skeleton */}
        <div className="lg:col-span-3">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-[300px] w-full" />
        </div>

        {/* Chart Skeleton */}
        <div className="lg:col-span-2">
           <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  );
}
