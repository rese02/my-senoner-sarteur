import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8 p-4">
      {/* Stories Skeleton */}
      <div>
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="flex space-x-4">
            <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
            </div>
             <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
            </div>
        </div>
      </div>
      
      {/* Recipe Skeleton */}
      <Skeleton className="h-[300px] md:h-[250px] w-full rounded-xl" />
      
      {/* Products Skeleton */}
       <div>
        <Skeleton className="h-9 w-full max-w-lg mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[350px] w-full rounded-xl" />
            <Skeleton className="h-[350px] w-full rounded-xl" />
            <Skeleton className="h-[350px] w-full rounded-xl" />
            <Skeleton className="h-[350px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
