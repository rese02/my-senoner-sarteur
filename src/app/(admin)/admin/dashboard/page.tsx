'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, Truck, AlertCircle, FileText } from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isFuture } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { OrderStatus, Order } from "@/lib/types";

const FormattedDate = ({ date, formatString, locale }: { date: Date, formatString: string, locale?: Locale }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    try {
        return <>{format(date, formatString, { locale })}</>;
    } catch (e) {
        return null;
    }
};

const statusMap: Record<OrderStatus, {label: string, className: string}> = {
  new: { label: 'Neu', className: 'bg-status-new-bg text-status-new-fg border-transparent' },
  picking: { label: 'Wird gepackt', className: 'bg-yellow-100 text-yellow-800 border-transparent' },
  ready: { label: 'Abholbereit', className: 'bg-status-ready-bg text-status-ready-fg border-transparent' },
  ready_for_delivery: { label: 'Bereit zur Lieferung', className: 'bg-status-ready-bg text-status-ready-fg border-transparent' },
  delivered: { label: 'Geliefert', className: 'bg-slate-100 text-slate-600 border-transparent' },
  collected: { label: 'Abgeholt', className: 'bg-status-collected-bg text-status-collected-fg border-transparent' },
  paid: { label: 'Bezahlt', className: 'bg-green-100 text-green-700 border-transparent' },
  cancelled: { label: 'Storniert', className: 'bg-status-cancelled-bg text-status-cancelled-fg border-transparent' }
};

function OrderCard({ order }: { order: Order }) {
  const pickupDate = order.pickupDate ? new Date(order.pickupDate) : null;
  const isPickupToday = pickupDate ? isToday(pickupDate) : false;
  const statusInfo = statusMap[order.status];
  const isGroceryList = order.type === 'grocery_list';

  return (
    <Card className="mb-4 transition-all hover:shadow-md">
      <Link href={`/admin/orders`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-full", isGroceryList ? 'bg-orange-100 text-orange-700' : 'bg-primary/10 text-primary')}>
                  {isGroceryList ? <FileText size={18} /> : <ShoppingCart size={18} />}
                </div>
                <div>
                    <p className="font-bold text-lg">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">#{order.id.slice(-6)}</p>
                </div>
             </div>
            <Badge className={cn("capitalize font-semibold", statusInfo?.className)}>
              {statusInfo?.label || order.status}
            </Badge>
          </div>
          <div className="mt-4 text-sm space-y-2">
             <p className="text-muted-foreground">
                {isGroceryList 
                    ? `Einkaufszettel: ${order.rawList?.split('\n').length || 0} Artikel`
                    : order.items?.map(item => `${item.quantity}x ${item.productName}`).join(', ')
                }
             </p>
             {pickupDate && (
                 <p className={cn("font-medium", isPickupToday ? "text-primary" : "")}>
                  Lieferung/Abholung: {isPickupToday ? "Heute" : <FormattedDate date={pickupDate} formatString="EEE, dd.MM." locale={de} />}
                </p>
             )}
              {order.total && (
                <p className="font-bold text-base pt-1 text-green-700">
                  Summe: €{order.total.toFixed(2)}
                </p>
              )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}


export default function AdminDashboardPage() {
    const today = new Date();

    const stats = useMemo(() => {
        const newOrdersToday = mockOrders.filter(o => isToday(new Date(o.createdAt)) && o.status === 'new').length;
        const pickupsToday = mockOrders.filter(o => o.pickupDate && isToday(new Date(o.pickupDate))).length;
        const overduePickups = mockOrders.filter(o => o.pickupDate && !isToday(new Date(o.pickupDate)) && !isFuture(new Date(o.pickupDate)) && (o.status === 'new' || o.status === 'ready' || o.status === 'picking')).length;

        return { newOrdersToday, pickupsToday, overduePickups };
    }, []);

    const recentAndUpcomingOrders = useMemo(() => {
        return mockOrders
            .filter(o => o.status === 'new' || o.status === 'ready' || o.status === 'picking' || o.status === 'ready_for_delivery')
            .sort((a, b) => new Date(a.pickupDate || a.createdAt).getTime() - new Date(b.pickupDate || b.createdAt).getTime())
            .slice(0, 10);
    }, []);

  return (
    <>
      <PageHeader title="Dashboard" description="Was muss ich heute sofort wissen?" />

      <div className="grid gap-4 grid-cols-3">
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
            <CardTitle className="text-sm font-medium">Lieferung/Abholung</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pickupsToday}</div>
          </CardContent>
        </Card>
        <Card className="border-destructive/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Überfällig</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overduePickups}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle & anstehende Bestellungen</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAndUpcomingOrders.length === 0 && (
                 <div className="text-center text-muted-foreground py-8">
                    Keine aktiven Bestellungen.
                </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
                {recentAndUpcomingOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
            </div>
             <div className="mt-6 text-center">
                <Button asChild variant="outline">
                    <Link href="/admin/orders">Alle Bestellungen anzeigen</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
