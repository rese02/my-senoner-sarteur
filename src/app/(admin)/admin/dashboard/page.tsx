'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, Truck, AlertCircle } from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, isToday, isFuture } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const FormattedDate = ({ date, formatString, locale }: { date: Date, formatString: string, locale?: Locale }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    try {
        return <>{format(date, formatString, { locale })}</>;
    } catch (e) {
        // Fallback for invalid dates
        return null;
    }
};

const statusMap: Record<string, {label: string, className: string}> = {
  new: { label: 'Neu', className: 'bg-status-new-bg text-status-new-fg border-transparent' },
  ready: { label: 'Abholbereit', className: 'bg-status-ready-bg text-status-ready-fg border-transparent' },
  collected: { label: 'Abgeholt', className: 'bg-status-collected-bg text-status-collected-fg border-transparent' },
  cancelled: { label: 'Storniert', className: 'bg-status-cancelled-bg text-status-cancelled-fg border-transparent' }
};

export default function AdminDashboardPage() {
    const today = new Date();

    const stats = useMemo(() => {
        const newOrdersToday = mockOrders.filter(o => isToday(new Date(o.createdAt)) && o.status === 'new').length;
        const pickupsToday = mockOrders.filter(o => isToday(new Date(o.pickupDate))).length;
        const overduePickups = mockOrders.filter(o => !isToday(new Date(o.pickupDate)) && !isFuture(new Date(o.pickupDate)) && (o.status === 'new' || o.status === 'ready')).length;

        return { newOrdersToday, pickupsToday, overduePickups };
    }, []);

    const recentAndUpcomingOrders = useMemo(() => {
        return mockOrders
            .filter(o => o.status === 'new' || o.status === 'ready')
            .sort((a, b) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime())
            .slice(0, 10);
    }, []);

  return (
    <>
      <PageHeader title="Dashboard" description="Was muss ich heute sofort wissen?" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neue Bestellungen heute</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newOrdersToday}</div>
            <p className="text-xs text-muted-foreground">Seit Mitternacht</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abholungen für heute</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pickupsToday}</div>
            <p className="text-xs text-muted-foreground">Bestellungen, die heute fällig sind</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Überfällige Abholungen</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overduePickups}</div>
            <p className="text-xs text-muted-foreground">Nicht abgeholte Bestellungen</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle &amp; anstehende Vorbestellungen</CardTitle>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Kunde</TableHead>
                        <TableHead>Bestellung (Kurz)</TableHead>
                        <TableHead>Abholung</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aktion</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentAndUpcomingOrders.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                Keine aktiven Bestellungen.
                            </TableCell>
                        </TableRow>
                    )}
                    {recentAndUpcomingOrders.map((order) => {
                        const pickupDate = new Date(order.pickupDate);
                        const isPickupToday = isToday(pickupDate);
                        const statusInfo = statusMap[order.status];
                        return (
                        <TableRow key={order.id} className="transition-colors hover:bg-muted/50 hover:shadow-lg hover:-translate-y-1">
                            <TableCell>
                                <div className="font-medium">{order.customerName}</div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {order.items.map(item => `${item.quantity}x ${item.productName}`).join(', ')}
                            </TableCell>
                            <TableCell>
                                <div className={isPickupToday ? "font-bold text-primary" : ""}>
                                    {isPickupToday ? "Heute" : <FormattedDate date={pickupDate} formatString="EEE, dd.MM." locale={de} />}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge 
                                    className={cn("capitalize font-semibold", statusInfo.className)}
                                >
                                    {statusInfo.label}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                               <Button asChild variant="ghost" size="sm" className="hover:scale-105 active:scale-[0.98]">
                                    <Link href={`/admin/orders`}>Details</Link>
                               </Button>
                            </TableCell>
                        </TableRow>
                    )})}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
