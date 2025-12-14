
'use client';

import { getCustomerOrders, deleteMyOrder } from "@/app/actions/order.actions";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Order, OrderStatus } from "@/lib/types";
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { Package, FileText, Calendar, Info, CheckCircle, Truck, ShoppingBag, XCircle, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Suspense, useState, useTransition, useEffect } from "react";
import Loading from './loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const statusMap: Record<OrderStatus, { label: string; className: string; icon: React.ElementType, colorClass: string }> = {
    new: { label: 'In Bearbeitung', className: 'bg-status-new-bg text-status-new-fg', icon: Info, colorClass: 'border-status-new-fg' },
    picking: { label: 'Wird gepackt', className: 'bg-yellow-100 text-yellow-800', icon: ShoppingBag, colorClass: 'border-yellow-500' },
    ready: { label: 'Abholbereit', className: 'bg-status-ready-bg text-status-ready-fg', icon: CheckCircle, colorClass: 'border-status-ready-fg' },
    ready_for_delivery: { label: 'Auf dem Weg', className: 'bg-status-ready-bg text-status-ready-fg', icon: Truck, colorClass: 'border-status-ready-fg' },
    delivered: { label: 'Geliefert', className: 'bg-status-collected-bg text-status-collected-fg', icon: CheckCircle, colorClass: 'border-status-collected-fg' },
    collected: { label: 'Abgeholt', className: 'bg-status-collected-bg text-status-collected-fg', icon: CheckCircle, colorClass: 'border-status-collected-fg' },
    paid: { label: 'Bezahlt', className: 'bg-green-100 text-green-700', icon: CheckCircle, colorClass: 'border-green-500' },
    cancelled: { label: 'Storniert', className: 'bg-status-cancelled-bg text-status-cancelled-fg', icon: XCircle, colorClass: 'border-status-cancelled-fg' }
};

function OrderHistoryCard({ order, onDelete }: { order: Order; onDelete: (orderId: string) => void }) {
    const [isDeleting, startDeleteTransition] = useTransition();
    const { toast } = useToast();

    const isGroceryList = order.type === 'grocery_list';
    const relevantDate = order.pickupDate || order.deliveryDate || order.createdAt;
    const StatusIcon = statusMap[order.status]?.icon || Info;
    const statusColor = statusMap[order.status]?.colorClass || 'border-primary';

    const deletableStatuses = ['collected', 'delivered', 'paid', 'cancelled'];
    const isDeletable = deletableStatuses.includes(order.status);
    
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Verhindert, dass Klick-Events auf der Karte ausgelöst werden
        startDeleteTransition(async () => {
            try {
                await deleteMyOrder(order.id);
                toast({ title: "Bestellung gelöscht" });
                onDelete(order.id);
            } catch (error: any) {
                toast({ variant: "destructive", title: "Fehler", description: error.message });
            }
        });
    };

    return (
        <Card className={cn("overflow-hidden shadow-lg border-l-4", statusColor)}>
            <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-4 p-4 relative">
                <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        {isGroceryList ? <FileText className="w-4 h-4 text-orange-500" /> : <Package className="w-4 h-4 text-primary" />}
                        {isGroceryList ? 'Concierge Bestellung' : 'Vorbestellung'}
                    </CardTitle>
                    <CardDescription className="text-xs">
                        #{order.id.slice(-6)} - {format(parseISO(order.createdAt), "dd.MM.yyyy, HH:mm")}
                    </CardDescription>
                </div>
                 <Badge className={cn("capitalize font-semibold text-xs whitespace-nowrap", statusMap[order.status]?.className)}>
                    <StatusIcon className="w-3 h-3 mr-1.5"/>
                    {statusMap[order.status]?.label}
                </Badge>
                {isDeletable && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={(e) => e.stopPropagation()}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bestellung wirklich löschen?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Diese Aktion kann nicht rückgängig gemacht werden. Die Bestellung wird endgültig aus Ihrer Historie entfernt.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                    Ja, löschen
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </CardHeader>
            <CardContent className="space-y-4 pt-0 p-4">
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
                                 <div key={item.productId} className="flex justify-between text-sm items-center py-1 border-b last:border-0">
                                     <span>{item.quantity}x {item.productName || item.productId}</span>
                                     <span className="font-mono text-muted-foreground">€{(item.price * item.quantity).toFixed(2)}</span>
                                 </div>
                             ))}
                         </div>
                    )}
                    {order.rawList && (
                        <div className="text-sm text-muted-foreground whitespace-pre-line bg-secondary/50 p-3 rounded-md border">
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
                    isGroceryList && (
                        <div className="text-center text-xs text-muted-foreground pt-2">
                            Endbetrag wird nach dem Packen berechnet.
                        </div>
                    )
                )}
            </CardContent>
        </Card>
    );
}

function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        setIsLoading(true);
        getCustomerOrders()
            .then(setOrders)
            .catch(() => toast({ variant: 'destructive', title: 'Fehler', description: 'Bestellungen konnten nicht geladen werden.' }))
            .finally(() => setIsLoading(false));
    }, [toast]);
    
    const handleOrderDeleted = (orderId: string) => {
        setOrders(currentOrders => currentOrders.filter(o => o.id !== orderId));
    };

    if (isLoading) {
        return <Loading />;
    }
    
    if (orders.length === 0) {
        return (
            <Card className="text-center py-16 text-muted-foreground border-dashed shadow-none">
                <Package className="mx-auto h-12 w-12 text-gray-300"/>
                <h3 className="mt-4 text-lg font-medium">Noch keine Bestellungen</h3>
                <p className="mt-1 text-sm">Ihre Bestellungen werden hier angezeigt.</p>
            </Card>
        );
    }
    
    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {orders.map(order => <OrderHistoryCard key={order.id} order={order} onDelete={handleOrderDeleted} />)}
         </div>
    );
}

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Meine Bestellungen" description="Hier sehen Sie den Status Ihrer aktuellen und vergangenen Bestellungen."/>
            <OrderList />
        </div>
    );
}
