import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/PageHeader";

export default function Loading() {
    return (
        <div className="space-y-6">
            <PageHeader title="Fidelity" description="Zeigen Sie Ihren QR-Code an der Kasse, um Stempel zu sammeln und Belohnungen einzulösen." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-[400px] w-full" />
                </div>
            </div>
        </div>
    )
}
