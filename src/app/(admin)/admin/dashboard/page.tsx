'use server';
import { getDashboardStats, getRecentOrders, getOrdersForChart } from "@/app/actions/product.actions";
import { Suspense } from "react";
import AdminDashboardLoading from "./loading";
import { DashboardClient } from "./client";
import { processOrderStatusUpdates } from "@/app/actions/cron.actions";


export default async function AdminDashboardPage() {
    // Führt bei jedem Besuch des Dashboards eine schnelle Überprüfung der Bestellstati durch
    // Dies simuliert einen einfachen Cron-Job, um Bestellungen als "abholbereit" zu markieren.
    await processOrderStatusUpdates();
    
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
