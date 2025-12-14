'use server';
import { PageHeader } from "@/components/common/PageHeader";
import { getOrdersPageData } from "@/app/actions/order.actions";
import { OrdersClient } from "./client";

export default async function AdminOrdersPage() {
  const { orders, users } = await getOrdersPageData();

  return (
    <div className="space-y-6">
      <PageHeader title="Bestellungen" description="Verwalten Sie alle Vorbestellungen und Einkaufszettel." />
      <OrdersClient initialOrders={orders} initialUsers={users} />
    </div>
  );
}
