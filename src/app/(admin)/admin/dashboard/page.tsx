
'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, ShoppingCart, Trash2, Loader2, CheckCircle, Euro } from "lucide-react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import type { Order, User, OrderStatus } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteOrder } from "@/app/actions/admin-cleanup.actions";
import { useToast } from "@/hooks/use-toast";
import { getDashboardPageData } from "@/app/actions/product.actions";
import { Badge } from "@/components/ui/badge";
import { OrdersByDayChart } from "./_components/OrdersByDayChart";
import AdminDashboardLoading from "./loading";
import { useRouter } from "next/navigation";
import { OrderCard } from "@/components/admin/OrderCard";


const statusMap: Record<OrderStatus, {label: string, className: string}> = {
  new: { label: 'Neu', className: 'bg-status-new-bg text-status-new-fg' },
  picking: { label: 'Wird gepackt', className: 'bg-yellow-100 text-yellow-800' },
  ready: { label: 'Abholbereit', className: 'bg-status-ready-bg text-status-ready-fg' },
  ready_for_delivery: { label: 'Bereit zur Lieferung', className: 'bg-status-ready-bg text-status-ready-fg' },
  delivered: { label: 'Geliefert', className: 'bg-status-collected-bg text-status-collected-fg' },
  collected: { label: 'Abgeholt', className: 'bg-status-collected-bg text-status-collected-fg' },
  paid: { label: 'Bezahlt', className: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Storniert', className: 'bg-status-cancelled-bg text-status-cancelled-fg' }
};

function OrderDetailsDeleteSection({ orderId, onClose }: { orderId: string, onClose: () => void }) {
    const { toast } = useToast();
    const [isDeleting, startDeleteTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        startDeleteTransition(async () => {
            const result = await deleteOrder(orderId);
            if (result.success) {
                toast({ title: "Gelöscht", description: "Bestellung wurde entfernt." });
                onClose(); // This closes the modal
                router.refresh(); // This re-fetches the server data
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
                        {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                        Bestellung löschen
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
                            {isDeleting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Löschen...</>) : 'Ja, löschen'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}


export default function AdminDashboardPage() {
    const [data, setData] = useState<{orders: Order[], users: User[], chartData: any[]} | null>(null);
    const [loading, setLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [customerDetails, setCustomerDetails] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();
    
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const fetchedData = await getDashboardPageData();
                setData(fetchedData);
            } catch(error: any) {
                toast({ variant: 'destructive', title: 'Daten-Fehler', description: "Dashboard-Daten konnten nicht geladen werden." });
            } finally {
                setLoading(false);
            }
        }
       loadData();
    }, [toast]);


    const handleShowDetails = (order: Order) => {
        if (!data) return;
        setSelectedOrder(order);
        const customer = data.users.find(u => u.id === order.userId) || null;
        setCustomerDetails(customer);
        setIsModalOpen(true);
    };

    if (loading || !data) {
        return <AdminDashboardLoading />;
    }
    
    const recentAndUpcomingOrders = data.orders
            .filter(o => ['new', 'picking', 'ready', 'ready_for_delivery'].includes(o.status))
            .sort((a, b) => new Date(a.pickupDate || a.createdAt).getTime() - new Date(b.pickupDate || b.createdAt).getTime());

    const totalCustomers = data.users.length;
        
    const statItems = [
        {
            title: "Kunden",
            value: totalCustomers,
            description: "Aktive Konten",
            icon: Users,
        },
        {
            title: "Offene Bestellungen",
            value: recentAndUpcomingOrders.length,
            description: "Aktiv",
            icon: ShoppingCart,
        },
    ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Willkommen zurück! Hier ist Ihre aktuelle Übersicht." />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {statItems.map((item) => (
            <Card key={item.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                </CardContent>
            </Card>
          ))}
      </div>


       <div className="grid gap-8 grid-cols-1 lg:grid-cols-5 items-start">
            <div className="lg:col-span-3 space-y-4">
                <h2 className="text-xl font-bold font-headline text-foreground">Dringende & Offene Bestellungen</h2>
                
                {recentAndUpcomingOrders.length === 0 ? (
                    <Card className="text-center text-muted-foreground p-8 h-full flex flex-col justify-center items-center">
                        <CheckCircle className="w-12 h-12 text-green-400 mb-2"/>
                        <p>Keine aktiven Bestellungen. Sehr gut!</p>
                    </Card>
                ) : (
                    <>
                        {/* Mobile View */}
                        <div className="md:hidden space-y-3">
                            {recentAndUpcomingOrders.slice(0, 10).map((order) => (
                                <OrderCard key={order.id} order={order} onShowDetails={() => handleShowDetails(order)} />
                            ))}
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block border rounded-lg overflow-hidden bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kunde</TableHead>
                                        <TableHead>Fälligkeit</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Gesamt</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentAndUpcomingOrders.slice(0, 10).map((order) => (
                                        <TableRow key={order.id} onClick={() => handleShowDetails(order)} className="cursor-pointer">
                                            <TableCell>
                                                <div className="font-medium">{order.customerName}</div>
                                                <div className="text-xs text-muted-foreground font-mono">#{order.id.slice(-6)}</div>
                                            </TableCell>
                                            <TableCell>{format(parseISO(order.pickupDate || order.deliveryDate || order.createdAt), "EEE, dd.MM.", { locale: de })}</TableCell>
                                            <TableCell><Badge className={cn("capitalize font-semibold", statusMap[order.status]?.className)}>{statusMap[order.status]?.label}</Badge></TableCell>
                                            <TableCell className="text-right font-medium">€{order.total?.toFixed(2) || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {recentAndUpcomingOrders.length > 10 && (
                            <Button asChild variant="outline" size="sm" className="w-full">
                                <Link href="/admin/orders">Alle {recentAndUpcomingOrders.length} offenen Bestellungen anzeigen</Link>
                            </Button>
                        )}
                    </>
                )}
            </div>

             <div className="lg:col-span-2">
                <OrdersByDayChart data={data.chartData} loading={loading} />
            </div>
       </div>

       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md m-4">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Bestelldetails</DialogTitle>
            <DialogDescription>
              Details für Bestellung #{selectedOrder?.id.slice(-6)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-6 pb-6">
              
              {customerDetails && (
                  <div className="space-y-3 pb-3 border-b">
                      <h3 className="font-semibold text-base">Kundendetails</h3>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                          <p className="text-muted-foreground">Name:</p>
                          <p className="font-medium">{customerDetails.name}</p>
                          <p className="text-muted-foreground">Email:</p>
                          <p className="font-medium">{customerDetails.email}</p>
                      </div>
                  </div>
              )}
              
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
                            
              <OrderDetailsDeleteSection orderId={selectedOrder.id} onClose={() => setIsModalOpen(false)} />

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
