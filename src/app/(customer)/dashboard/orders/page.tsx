
'use server';

import { getCustomerOrders } from "@/app/actions/order.actions";
import { PageHeader } from "@/components/common/PageHeader";
import { Suspense } from "react";
import Loading from './loading';
import { OrdersClient } from "./client";

async function OrderList() {
    const orders = await getCustomerOrders();
    return <OrdersClient initialOrders={orders} />;
}

export default async function OrdersPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Meine Bestellungen" description="Hier sehen Sie den Status Ihrer aktuellen und vergangenen Bestellungen."/>
            <Suspense fallback={<Loading />}>
                <OrderList />
            </Suspense>
        </div>
    );
}
