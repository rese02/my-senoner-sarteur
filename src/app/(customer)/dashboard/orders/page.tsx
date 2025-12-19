

'use client'; // This must be a client component to use the hook

import { getCustomerOrders } from "@/app/actions/order.actions";
import { PageHeader } from "@/components/common/PageHeader";
import { Suspense, useEffect, useState } from "react";
import Loading from './loading';
import { OrdersClient } from "./client";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
    const { t } = useLanguage();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getCustomerOrders()
            .then(setOrders)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader title={t.orders.title} description={t.orders.description}/>
            {isLoading ? (
                <Loading />
            ) : (
                <OrdersClient initialOrders={orders} />
            )}
        </div>
    );
}

    