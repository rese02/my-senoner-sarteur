

'use server';

import { getCustomerOrders } from "@/app/actions/order.actions";
import { PageHeader } from "@/components/common/PageHeader";
import { Suspense } from "react";
import Loading from './loading';
import { OrdersClient } from "./client";
import { getTranslations } from "@/lib/translations";

export default async function OrdersPage() {
    const t = await getTranslations();
    
    // Data is now fetched on the server
    const orders = await getCustomerOrders();

    return (
        <div className="space-y-6">
            <PageHeader title={t.orders.title} description={t.orders.description}/>
            <Suspense fallback={<Loading />}>
                <OrdersClient initialOrders={orders} />
            </Suspense>
        </div>
    );
}

    
