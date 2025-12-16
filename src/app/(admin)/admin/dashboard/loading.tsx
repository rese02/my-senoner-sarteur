
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Willkommen zurück! Hier ist Ihre aktuelle Übersicht." />

      {/* Stat Cards Skeleton */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>

      <div className="grid gap-8 lg:grid-cols-5 items-start">
        {/* Recent Orders Skeleton */}
        <div className="lg:col-span-3">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>

        {/* Chart Skeleton */}
        <div className="lg:col-span-2">
           <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
