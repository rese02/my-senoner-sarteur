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
      <div className="grid gap-4 grid-cols-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Chart Skeleton */}
        <div className="lg:col-span-2">
           <Skeleton className="h-[400px] w-full" />
        </div>
        
        {/* Recent Orders Skeleton */}
        <div>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                 <Skeleton className="h-16 w-full" />
            </div>
        </div>
      </div>
    </div>
  );
}
