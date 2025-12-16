
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function Loading() {
    return (
        <div className="p-4 space-y-8 flex flex-col items-center max-w-md mx-auto">
             <div className="text-center space-y-2 w-full">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-10 w-32 mx-auto" />
            </div>
            <Skeleton className="w-full h-80" />
            <Skeleton className="w-full h-96" />
        </div>
    )
}
