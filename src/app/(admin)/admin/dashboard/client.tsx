
'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, ShoppingCart, Trash2, Loader2, CheckCircle, Euro, Home, MoreVertical } from "lucide-react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useTransition } from "react";
import type { Order, User, OrderStatus } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteOrder } from '@/app/actions/admin-cleanup.actions';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { OrdersByDayChart } from "./_components/OrdersByDayChart";
import { useRouter } from "next/navigation";
import { STATUS_MAP } from "@/lib/types";
import { useLanguage } from "@/components/providers/LanguageProvider";

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

interface DashboardClientProps {
    initialStats: {
        totalOrders: number;
        totalCustomers: number;
        openOrders: number;
    };
    initialRecentOrders: Order[];
    initialChartData: any[];
}


export function DashboardClient({ initialStats, initialRecentOrders, initialChartData }: DashboardClientProps) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useLanguage();
    
    const handleShowDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const statItems = [
        {
            title: "Kunden",
            value: initialStats.totalCustomers,
            description: "Aktive Konten",
            icon: Users,
        },
        {
            title: "Offene Bestellungen",
            value: initialStats.openOrders,
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
            <Card className="flex flex-col lg:col-span-3">
                <CardHeader>
                    <CardTitle>Dringende & Offene Bestellungen</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow p-0">
                {initialRecentOrders.length === 0 ? (
                    <div className="text-center text-muted-foreground p-8 h-full flex flex-col justify-center items-center">
                        <CheckCircle className="w-12 h-12 text-green-400 mb-2"/>
                        <p>Keine aktiven Bestellungen. Sehr gut!</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Kunde</TableHead>
                                <TableHead>Fälligkeit</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aktion</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialRecentOrders.map((order) => {
                                const statusInfo = STATUS_MAP[order.status];
                                const statusLabelKey = statusInfo.labelKey as keyof typeof t.status;
                                const statusLabel = statusLabelKey ? t.status[statusLabelKey] : order.status;
                                const StatusIcon = statusInfo?.icon;
                                return (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <div className="font-bold">{order.customerName}</div>
                                        <div className="text-xs text-muted-foreground">
                                            <span>#{order.id.slice(-6)}</span>
                                            <span className="mx-1.5">•</span>
                                            <span>{order.items?.length || order.rawList?.split('\n').length} Artikel</span>
                                            {order.total && order.total > 0 && <span className="font-normal"><span className="mx-1.5">•</span>€{order.total?.toFixed(2)}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>{format(parseISO(order.pickupDate || order.deliveryDate || order.createdAt), "EEE, dd.MM.", { locale: de })}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn("capitalize font-semibold text-xs border-0", statusInfo?.className)}>
                                            {StatusIcon && <StatusIcon className="w-3 h-3 mr-1.5"/>}
                                            {statusLabel}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleShowDetails(order)}>Details</Button>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                )}
                </CardContent>
                {initialStats.openOrders > 0 && (
                    <CardFooter className="justify-center border-t pt-4">
                        <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href="/admin/orders">Alle {initialStats.openOrders} offenen Bestellungen anzeigen</Link>
                        </Button>
                    </CardFooter>
                )}
            </Card>

             <div className="lg:col-span-2">
                <OrdersByDayChart data={initialChartData} loading={false} />
            </div>
       </div>

       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bestelldetails</DialogTitle>
            <DialogDescription>
              Details für Bestellung #{selectedOrder?.id.slice(-6)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-6 pb-6">
              <div className="space-y-3">
                  <h3 className="font-semibold text-base">Bestellübersicht</h3>
                   <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                        <p className="text-muted-foreground">{selectedOrder.type === 'grocery_list' ? 'Lieferung:' : 'Abholung:'}</p>
                        <p className="font-medium">{format(parseISO(selectedOrder.pickupDate || selectedOrder.deliveryDate || selectedOrder.createdAt), "EEEE, dd.MM.yyyy", { locale: de })}</p>
                        <p className="text-muted-foreground">Status:</p>
                        <div>
                            <Badge className={cn("capitalize font-semibold", STATUS_MAP[selectedOrder.status]?.className)}>
                                {t.status[STATUS_MAP[selectedOrder.status]?.labelKey as keyof typeof t.status] || selectedOrder.status}
                            </Badge>
                        </div>
                   </div>
                  
                  {selectedOrder.type === 'grocery_list' && selectedOrder.deliveryAddress && (
                    <div className="p-3 bg-secondary rounded-lg border text-sm">
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><Home className="w-4 h-4 text-muted-foreground"/>Lieferadresse</h4>
                        <p>{selectedOrder.deliveryAddress.street}</p>
                        <p>{selectedOrder.deliveryAddress.zip} {selectedOrder.deliveryAddress.city}</p>
                    </div>
                  )}

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
                  {selectedOrder.total && selectedOrder.total > 0 ? (
                    <div className="flex justify-end font-bold text-lg border-t pt-3 mt-2">
                        Gesamt: €{selectedOrder.total.toFixed(2)}
                    </div>
                  ) : selectedOrder.type === 'grocery_list' && (
                    <div className="text-center text-xs text-muted-foreground pt-2 border-t mt-2">
                        Endbetrag wird nach dem Packen berechnet.
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
