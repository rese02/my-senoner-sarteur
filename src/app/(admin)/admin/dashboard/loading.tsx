
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Page Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-5 items-start">
        {/* Urgent Orders Skeleton */}
        <div className="lg:col-span-3 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        
        {/* Sidebar Skeleton (Stats + Chart) */}
        <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
           <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  );
}
