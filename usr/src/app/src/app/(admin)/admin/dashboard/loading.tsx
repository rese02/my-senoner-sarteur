
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-5 items-start">
        <div className="lg:col-span-3 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-8">
           <Skeleton className="h-[480px] w-full" />
        </div>
      </div>
    </div>
  );
}
