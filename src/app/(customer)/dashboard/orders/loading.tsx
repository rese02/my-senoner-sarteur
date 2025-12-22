import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
      <div className="space-y-6 pb-24 md:pb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-l-4 border-gray-200 overflow-hidden shadow-sm bg-card rounded-lg">
            <div className="p-4">
              <div className="flex flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

               <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
               </div>
              
               <div className="flex justify-between items-baseline mt-4 pt-4 border-t">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-7 w-24" />
                </div>
            </div>
          </div>
        ))}
      </div>
  );
}
