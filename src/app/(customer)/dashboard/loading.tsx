import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Stories Skeleton */}
      <div className="flex space-x-4">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-[70px] w-[70px] rounded-full" />
            </div>
        ))}
      </div>
      
      {/* Feature Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[150px] w-full rounded-2xl" />
        <Skeleton className="h-[150px] w-full rounded-2xl" />
      </div>
      
      {/* Products Skeleton */}
       <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-[280px] w-full rounded-xl" />
            <Skeleton className="h-[280px] w-full rounded-xl" />
            <Skeleton className="h-[280px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
