

'use server';

import { getCustomerOrders } from "@/app/actions/order.actions";
import { PageHeader } from "@/components/common/PageHeader";
import { Suspense } from "react";
import Loading from './loading';
import { OrdersClient } from "./client";

// This component is temporary to translate the server-side text
function TranslatedHeader() {
    // This is a workaround to use the hook on the server.
    // In a real app router scenario, you'd pass lang as a param.
    // For now, we assume this is not needed or handled differently.
    // Let's just render the german text for now.
    return (
        <PageHeader title={"Meine Bestellungen"} description={"Hier sehen Sie den Status Ihrer aktuellen und vergangenen Bestellungen."}/>
    )
}

async function OrderList() {
    const orders = await getCustomerOrders();
    return <OrdersClient initialOrders={orders} />;
}

export default async function OrdersPage() {
    return (
        <div className="space-y-6">
            <TranslatedHeader />
            <Suspense fallback={<Loading />}>
                <OrderList />
            </Suspense>
        </div>
    );
}
