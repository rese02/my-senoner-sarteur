'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, ShoppingCart, Truck, AlertCircle, Trash2, Loader2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isToday, isFuture, isPast, format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useMemo, useTransition, useEffect } from "react";
import type { Order, User, OrderStatus } from "@/lib/types";
import { OrderCard } from "@/components/admin/OrderCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteOrder } from "@/app/actions/admin-cleanup.actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getDashboardPageData } from "@/app/actions/dashboard.actions";


const statusMap: Record<OrderStatus, {label: string, className: string}> = {
  new: { label: 'Neu', className: 'bg-blue-100 text-blue-800' },
  picking: { label: 'Wird gepackt', className: 'bg-yellow-100 text-yellow-800' },
  ready: { label: 'Abholbereit', className: 'bg-green-100 text-green-700' },
  ready_for_delivery: { label: 'Bereit zur Lieferung', className: 'bg-green-100 text-green-700' },
  delivered: { label: 'Geliefert', className: 'bg-gray-100 text-gray-800' },
  collected: { label: 'Abgeholt', className: 'bg-gray-100 text-gray-800' },
  paid: { label: 'Bezahlt', className: 'bg-teal-100 text-teal-800' },
  cancelled: { label: 'Storniert', className: 'bg-red-100 text-red-800' }
};

function OrderDetailsDeleteSection({ orderId, onClose }: { orderId: string, onClose: () => void }) {
    const { toast } = useToast();
    const [isDeleting, startDeleteTransition] = useTransition();

    const handleDelete = () => {
        startDeleteTransition(async () => {
            const result = await deleteOrder(orderId);
            if (result.success) {
                toast({ title: "Gelöscht", description: "Bestellung wurde entfernt." });
                onClose();
            } else {
                 toast({ variant: 'destructive', title: 'Fehler', description: result.error || 'Konnte nicht gelöscht werden.' });
            }
        });
    };

    return (
        <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-bold text-muted-foreground uppercase mb-3">Verwaltung</h3>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full md:w-auto" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Bestellung endgültig löschen
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sind Sie absolut sicher?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Diese Aktion kann nicht rückgängig gemacht werden. Die Bestellung wird permanent aus der Datenbank entfernt.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                            {isDeleting ? 'Löschen...' : 'Ja, löschen'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}


export default function AdminDashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [customerDetails, setCustomerDetails] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();
    
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const { orders: fetchedOrders, users: fetchedUsers } = await getDashboardPageData();
                setOrders(fetchedOrders);
                setUsers(fetchedUsers);
            } catch(error: any) {
                toast({ variant: 'destructive', title: 'Daten-Fehler', description: error.message });
            } finally {
                setLoading(false);
            }
        }
        if (!isModalOpen) {
           loadData();
        }
    }, [isModalOpen, toast]);

    const stats = useMemo(() => {
        const newOrdersToday = orders.filter(o => isToday(parseISO(o.createdAt)) && o.status === 'new').length;
        const pickupsToday = orders.filter(o => o.pickupDate && isToday(parseISO(o.pickupDate))).length;
        const overduePickups = orders.filter(o => {
            const pickup = o.pickupDate ? parseISO(o.pickupDate) : null;
            if (!pickup) return false;
            return isPast(pickup) && !isToday(pickup) && ['new', 'ready', 'picking', 'ready_for_delivery'].includes(o.status);
        }).length;

        return { newOrdersToday, pickupsToday, overduePickups };
    }, [orders]);

    const recentAndUpcomingOrders = useMemo(() => {
        return orders
            .filter(o => ['new', 'picking', 'ready', 'ready_for_delivery'].includes(o.status))
            .sort((a, b) => new Date(a.pickupDate || a.createdAt).getTime() - new Date(b.pickupDate || b.createdAt).getTime())
            .slice(0, 10);
    }, [orders]);

    const handleShowDetails = (order: Order) => {
        setSelectedOrder(order);
        const customer = users.find(u => u.id === order.userId) || null;
        setCustomerDetails(customer);
        setIsModalOpen(true);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Willkommen zurück! Hier ist Ihre heutige Übersicht." />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neue Bestellungen heute</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.newOrdersToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abholungen/Lieferungen heute</CardTitle>
            <Truck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pickupsToday}</div>
          </CardContent>
        </Card>
        <Card className={cn(stats.overduePickups > 0 && "border-destructive/50 bg-destructive/5 text-destructive")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Überfällige Abholungen</CardTitle>
            <AlertCircle className={cn("h-5 w-5", stats.overduePickups > 0 ? 'text-destructive' : 'text-muted-foreground')} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.overduePickups}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle & anstehende Bestellungen</CardTitle>
            <CardDescription>Die 10 dringendsten Bestellungen, sortiert nach Fälligkeit.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAndUpcomingOrders.length === 0 ? (
                 <div className="text-center text-muted-foreground py-8">
                    Keine aktiven Bestellungen. Sehr gut!
                </div>
            ) : (
                <div className="space-y-3">
                    {recentAndUpcomingOrders.map((order) => (
                      <OrderCard key={order.id} order={order} onShowDetails={() => handleShowDetails(order)} />
                    ))}
                </div>
            )}
             <div className="mt-6 text-center">
                <Button asChild variant="outline" size="sm">
                    <Link href="/admin/orders">Alle Bestellungen anzeigen</Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>

       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md m-4">
          <DialogHeader>
            <DialogTitle>Bestelldetails</DialogTitle>
            <DialogDescription>
              Details für Bestellung #{selectedOrder?.id.slice(-6)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-3">
                  <h3 className="font-semibold text-base">Bestellübersicht</h3>
                   <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                        <p className="text-muted-foreground">{selectedOrder.type === 'grocery_list' ? 'Lieferung:' : 'Abholung:'}</p>
                        <p className="font-medium">{format(parseISO(selectedOrder.pickupDate || selectedOrder.deliveryDate || selectedOrder.createdAt), "EEEE, dd.MM.yyyy", { locale: de })}</p>
                        <p className="text-muted-foreground">Status:</p>
                        <div><Badge className={cn("capitalize font-semibold", statusMap[selectedOrder.status]?.className)}>{statusMap[selectedOrder.status]?.label}</Badge></div>
                   </div>
                  
                  {selectedOrder.type === 'preorder' && selectedOrder.items && (
                      <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produkt</TableHead>
                                <TableHead>Menge</TableHead>
                                <TableHead className="text-right">Preis</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedOrder.items.map(item => (
                                <TableRow key={item.productId}>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell className="text-right">€{(item.price * item.quantity).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                  )}

                  {selectedOrder.type === 'grocery_list' && selectedOrder.rawList && (
                      <div>
                          <h4 className="font-semibold mt-3 mb-2">Einkaufszettel</h4>
                          <div className="p-3 bg-secondary rounded-md text-sm whitespace-pre-line text-muted-foreground">
                            {selectedOrder.rawList}
                          </div>
                      </div>
                  )}
                  {selectedOrder.total && (
                    <div className="flex justify-end font-bold text-lg border-t pt-3 mt-2">
                        Gesamt: €{selectedOrder.total.toFixed(2)}
                    </div>
                  )}
              </div>
              
              {customerDetails && (
                  <div className="space-y-3 pt-3 border-t">
                      <h3 className="font-semibold text-base">Kundendetails</h3>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                          <p className="text-muted-foreground">Name:</p>
                          <p className="font-medium">{customerDetails.name}</p>
                          <p className="text-muted-foreground">Email:</p>
                          <p className="font-medium">{customerDetails.email}</p>
                          <p className="text-muted-foreground">Kunde seit:</p>
                          <p className="font-medium">{customerDetails.customerSince ? format(parseISO(customerDetails.customerSince), 'dd.MM.yyyy') : 'N/A'}</p>
                      </div>
                  </div>
              )}
                
              <OrderDetailsDeleteSection orderId={selectedOrder.id} onClose={() => setIsModalOpen(false)} />

               <DialogClose asChild>
                <Button variant="outline" className="mt-4">Schließen</Button>
              </DialogClose>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
