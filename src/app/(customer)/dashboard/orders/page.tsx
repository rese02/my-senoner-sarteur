import { getCustomerOrders } from "@/app/actions/order.actions";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Order, OrderStatus } from "@/lib/types";
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { Package, FileText, Calendar, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const statusMap: Record<OrderStatus, { label: string; className: string; icon: React.ElementType }> = {
    new: { label: 'Neu', className: 'bg-status-new-bg text-status-new-fg', icon: Info },
    picking: { label: 'Wird gepackt', className: 'bg-yellow-100 text-yellow-800', icon: Package },
    ready: { label: 'Abholbereit', className: 'bg-status-ready-bg text-status-ready-fg', icon: Package },
    ready_for_delivery: { label: 'Bereit zur Lieferung', className: 'bg-status-ready-bg text-status-ready-fg', icon: Package },
    delivered: { label: 'Geliefert', className: 'bg-slate-100 text-slate-600', icon: Package },
    collected: { label: 'Abgeholt', className: 'bg-status-collected-bg text-status-collected-fg', icon: Package },
    paid: { label: 'Bezahlt', className: 'bg-green-100 text-green-700', icon: Package },
    cancelled: { label: 'Storniert', className: 'bg-status-cancelled-bg text-status-cancelled-fg', icon: AlertTriangle }
};

function OrderHistoryCard({ order }: { order: Order }) {
    const isGroceryList = order.type === 'grocery_list';
    const relevantDate = order.pickupDate || order.deliveryDate || order.createdAt;
    const StatusIcon = statusMap[order.status].icon;

    return (
        <Card className="shadow-md border-l-4" style={{ borderLeftColor: `hsl(var(--${statusMap[order.status].className.split(' ')[0].replace('bg-', '')}))`}}>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base font-bold">
                        {isGroceryList ? 'Concierge Bestellung' : 'Vorbestellung'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                        #{order.id.slice(-6)} - {format(parseISO(order.createdAt), "dd.MM.yyyy, HH:mm")}
                    </CardDescription>
                </div>
                <Badge className={cn("capitalize", statusMap[order.status].className)}>
                    <StatusIcon className="w-3 h-3 mr-1.5"/>
                    {statusMap[order.status].label}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm bg-secondary p-3 rounded-md">
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4"/>
                        <span>{isGroceryList ? 'Lieferung am' : 'Abholung am'}</span>
                     </div>
                     <span className="font-bold">{format(parseISO(relevantDate), "EEEE, dd.MM.yyyy", { locale: de })}</span>
                </div>

                <div>
                    {order.items && order.items.length > 0 && (
                         <div className="space-y-2">
                             {order.items.map(item => (
                                 <div key={item.productId} className="flex justify-between text-sm">
                                     <span>{item.quantity}x {item.productName}</span>
                                     <span className="font-mono">€{(item.price * item.quantity).toFixed(2)}</span>
                                 </div>
                             ))}
                         </div>
                    )}
                    {order.rawList && (
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary/50 p-3 rounded-md border">
                            {order.rawList}
                        </div>
                    )}
                </div>

                {order.total && order.total > 0 ? (
                    <>
                        <Separator/>
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-bold">Gesamt</span>
                            <span className="text-xl font-bold text-primary">€{order.total.toFixed(2)}</span>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-xs text-muted-foreground pt-2">
                        Endbetrag wird nach dem Packen berechnet.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default async function OrdersPage() {
    const orders = await getCustomerOrders();

    return (
        <>
            <PageHeader title="Meine Bestellungen" description="Hier sehen Sie den Status Ihrer aktuellen und vergangenen Bestellungen."/>

            <div className="space-y-6 pb-24 md:pb-8">
                {orders.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-dashed">
                        <Package className="mx-auto h-12 w-12 text-gray-300"/>
                        <h3 className="mt-4 text-lg font-medium">Noch keine Bestellungen</h3>
                        <p className="mt-1 text-sm">Ihre Bestellungen werden hier angezeigt.</p>
                    </div>
                ) : (
                    orders.map(order => <OrderHistoryCard key={order.id} order={order} />)
                )}
            </div>
        </>
    );
}
