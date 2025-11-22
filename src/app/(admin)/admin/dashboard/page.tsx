'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, Truck, AlertCircle, Trash2 } from "lucide-react";
import { mockOrders, mockUsers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { isToday, isFuture, isPast, format } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useMemo, useTransition } from "react";
import type { Order, User, OrderStatus } from "@/lib/types";
import { OrderCard } from "@/components/admin/OrderCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteOrder } from "@/app/actions/admin-cleanup.actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


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

function OrderDetailsDeleteSection({ orderId }: { orderId: string }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleting, startDeleteTransition] = useTransition();

    const handleDelete = () => {
        startDeleteTransition(async () => {
            await deleteOrder(orderId);
            toast({ title: "Gelöscht", description: "Bestellung wurde entfernt." });
            router.refresh(); 
        });
    };

    return (
        <div className="mt-8 pt-6 border-t">
            <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4">Verwaltung</h3>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full md:w-auto">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Diese Bestellung endgültig löschen
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
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                            {isDeleting ? 'Löschen...' : 'Ja, löschen'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function AdminDashboardPage() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [customerDetails, setCustomerDetails] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const stats = useMemo(() => {
        const newOrdersToday = mockOrders.filter(o => isToday(new Date(o.createdAt)) && o.status === 'new').length;
        const pickupsToday = mockOrders.filter(o => o.pickupDate && isToday(new Date(o.pickupDate))).length;
        const overduePickups = mockOrders.filter(o => {
            const pickup = o.pickupDate ? new Date(o.pickupDate) : null;
            if (!pickup) return false;
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

    const handleShowDetails = (order: Order) => {
        setSelectedOrder(order);
        const customer = mockUsers.find(u => u.id === order.userId) || null;
        setCustomerDetails(customer);
        setIsModalOpen(true);
    };

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
                      <OrderCard key={order.id} order={order} onShowDetails={() => handleShowDetails(order)} />
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

       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md m-4">
          <DialogHeader>
            <DialogTitle>Bestelldetails</DialogTitle>
            <DialogDescription>
              Bestellung #{selectedOrder?.id.slice(-6)} vom{' '}
              {selectedOrder && format(new Date(selectedOrder.createdAt), "dd.MM.yyyy, HH:mm")}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Bestellübersicht</h3>
                   <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">{selectedOrder.type === 'grocery_list' ? 'Lieferung:' : 'Abholung:'}</p>
                        <p className="font-medium">{format(new Date(selectedOrder.pickupDate || selectedOrder.deliveryDate || selectedOrder.createdAt), "EEEE, dd.MM.yyyy", { locale: de })}</p>
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
                          <h4 className="font-semibold mt-4 mb-2">Einkaufszettel</h4>
                          <div className="p-4 bg-secondary rounded-md text-sm whitespace-pre-line text-muted-foreground">
                            {selectedOrder.rawList}
                          </div>
                      </div>
                  )}
                  {selectedOrder.total && (
                    <div className="flex justify-end font-bold text-lg border-t pt-4 mt-2">
                        Gesamt: €{selectedOrder.total.toFixed(2)}
                    </div>
                  )}
              </div>
              
              {customerDetails && (
                  <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold text-lg">Kundendetails</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                          <p className="text-muted-foreground">Name:</p>
                          <p className="font-medium">{customerDetails.name}</p>
                          <p className="text-muted-foreground">Email:</p>
                          <p className="font-medium">{customerDetails.email}</p>
                          <p className="text-muted-foreground">Kunde seit:</p>
                          <p className="font-medium">{customerDetails.customerSince ? format(new Date(customerDetails.customerSince), 'dd.MM.yyyy') : 'N/A'}</p>
                      </div>
                  </div>
              )}
                
              <OrderDetailsDeleteSection orderId={selectedOrder.id} />

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
