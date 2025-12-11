'use server';

import { getCustomersPageData } from "@/app/actions/customer.actions";
import { PageHeader } from "@/components/common/PageHeader";
import { CustomersClient } from './client';

export default async function AdminCustomersPage() {
    const { customers, orders, products, categories } = await getCustomersPageData();

    return (
        <div className="space-y-6">
            <PageHeader title="Kunden" description="Engagieren Sie sich mit Ihren Kunden und führen Sie Marketingkampagnen durch." />
            <CustomersClient 
                initialCustomers={customers} 
                initialOrders={orders} 
                initialProducts={products}
                initialCategories={categories}
            />
        </div>
    );
}
