'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, Truck, AlertCircle } from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { isToday, isFuture, isPast } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMemo } from "react";
import type { Order } from "@/lib/types";
import { OrderCard } from "@/components/admin/OrderCard";


export default function AdminDashboardPage() {
    const today = new Date();

    const stats = useMemo(() => {
        const newOrdersToday = mockOrders.filter(o => isToday(new Date(o.createdAt)) && o.status === 'new').length;
        const pickupsToday = mockOrders.filter(o => o.pickupDate && isToday(new Date(o.pickupDate))).length;
        const overduePickups = mockOrders.filter(o => {
            const pickup = o.pickupDate ? new Date(o.pickupDate) : null;
            if (!pickup) return false;
            // Overdue means the pickup date is in the past, but the order is not yet collected/delivered/cancelled.
            return isPast(pickup) && !isToday(pickup) && ['new', 'ready', 'picking', 'ready_for_delivery'].includes(o.status);
        }).length;

        return { newOrdersToday, pickupsToday, overduePickups };
    }, []);

    const recentAndUpcomingOrders = useMemo(() => {
        return mockOrders
            .filter(o => ['new', 'picking', 'ready', 'ready_for_delivery'].includes(o.status))
            .sort((a, b) => new Date(a.pickupDate || a.createdAt).getTime() - new Date(b.pickupDate || b.createdAt).getTime())
            .slice(0, 10);
    }, []);

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Was muss ich heute sofort wissen?" />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neue Bestellungen heute</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newOrdersToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lieferung/Abholung heute</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pickupsToday}</div>
          </CardContent>
        </Card>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Überfällige Abholungen</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overduePickups}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle & anstehende Bestellungen</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAndUpcomingOrders.length === 0 ? (
                 <div className="text-center text-muted-foreground py-8">
                    Keine aktiven Bestellungen. Sehr gut!
                </div>
            ) : (
                <div className="space-y-3">
                    {recentAndUpcomingOrders.map((order) => (
                      <OrderCard key={order.id} order={order} onShowDetails={() => { /* In a real app, this would open a dialog */ }} />
                    ))}
                </div>
            )}
             <div className="mt-6 text-center">
                <Button asChild variant="outline">
                    <Link href="/admin/orders">Alle Bestellungen anzeigen</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
