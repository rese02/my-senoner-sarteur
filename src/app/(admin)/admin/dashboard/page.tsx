
'use server';
import { PageHeader } from "@/components/common/PageHeader";
import { getDashboardStats, getRecentOrders, getOrdersForChart } from "@/app/actions/product.actions";
import { Suspense } from "react";
import AdminDashboardLoading from "./loading";
import { DashboardClient } from "./client";


export default async function AdminDashboardPage() {
    // Daten werden jetzt serverseitig abgerufen
    const stats = await getDashboardStats();
    const recentOrders = await getRecentOrders();
    const chartData = await getOrdersForChart();
    
    return (
        <Suspense fallback={<AdminDashboardLoading />}>
            <DashboardClient 
                initialStats={stats}
                initialRecentOrders={recentOrders}
                initialChartData={chartData}
            />
        </Suspense>
    );
}
