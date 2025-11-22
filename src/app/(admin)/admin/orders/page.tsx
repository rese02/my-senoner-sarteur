'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { mockOrders, mockUsers } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Search, FileText, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useTransition, useEffect } from "react";
import type { Order, OrderStatus, User } from "@/lib/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { OrderCard } from "@/components/admin/OrderCard";

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

const FormattedDate = ({ date, formatString, locale }: { date: Date, formatString: string, locale?: Locale }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    try {
        return <>{format(date, formatString, { locale })}</>;
    } catch(e) {
        return null;
    }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customerDetails, setCustomerDetails] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(() => {
        const originalOrders = [...orders];
        setOrders(prevOrders => prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));

        new Promise<boolean>((resolve) => {
            setTimeout(() => {
                const success = Math.random() > 0.1;
                resolve(success);
            }, 500);
        }).then(success => {
            if (success) {
                toast({
                    title: "Status aktualisiert",
                    description: `Bestellung #${orderId.slice(-6)} ist jetzt "${statusMap[newStatus].label}".`
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: "Fehler",
                    description: "Status konnte nicht aktualisiert werden."
                });
                setOrders(originalOrders);
            }
        });
    });
  };

  const handleShowDetails = (order: Order) => {
    setSelectedOrder(order);
    const customer = mockUsers.find(u => u.id === order.userId) || null;
    setCustomerDetails(customer);
    setIsModalOpen(true);
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = 
          order.customerName.toLowerCase().includes(lowerSearchTerm) ||
          order.id.toLowerCase().includes(lowerSearchTerm);
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="pb-24 md:pb-0">
      <PageHeader title="Bestellungen" description="Verwalten Sie alle Vorbestellungen und Einkaufszettel." />
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <CardTitle>Alle Bestellungen</CardTitle>
             <div className="flex gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Kunde oder ID suchen..." 
                        className="pl-8 bg-card"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={(value: OrderStatus | 'all') => setStatusFilter(value)}>
                    <SelectTrigger className="w-full md:w-[180px] bg-card">
                        <SelectValue placeholder="Status filtern" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Alle Status</SelectItem>
                        {Object.keys(statusMap).map(s => (
                              <SelectItem key={s} value={s} className="capitalize text-xs">{statusMap[s as OrderStatus].label}</SelectItem>
                          ))}
                    </SelectContent>
                </Select>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bestell-ID</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Fälligkeit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">Keine Bestellungen gefunden.</TableCell>
                  </TableRow>
                )}
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="transition-colors hover:bg-secondary">
                    <TableCell className="font-mono text-xs">#{order.id.slice(-6)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         {order.type === 'grocery_list' 
                          ? <FileText className="h-4 w-4 text-orange-600"/>
                          : <ShoppingCart className="h-4 w-4 text-primary"/>
                         }
                         <span className="text-xs">{order.type === 'grocery_list' ? 'Liste' : 'Vorb.'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{
                      order.type === 'grocery_list' 
                      ? `${order.rawList?.split('\n').length} Artikel`
                      : order.items?.map(i => `${i.quantity}x ${i.productName}`).join(', ')
                    }</TableCell>
                    <TableCell className="text-right font-semibold">{order.total ? `€${order.total.toFixed(2)}` : '-'}</TableCell>
                    <TableCell><FormattedDate date={new Date(order.pickupDate || order.deliveryDate || order.createdAt)} formatString="EEE, dd.MM." locale={de} /></TableCell>
                    <TableCell>
                      <Select 
                        value={order.status} 
                        onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                        disabled={isPending}
                      >
                        <SelectTrigger className="h-8 w-[140px] capitalize text-xs bg-card focus:ring-primary/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(statusMap).map(s => (
                              <SelectItem key={s} value={s} className="capitalize text-xs">{statusMap[s as OrderStatus].label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleShowDetails(order)}>Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden space-y-4">
             {filteredOrders.length === 0 && (
                <div className="text-center text-muted-foreground py-16">Keine Bestellungen gefunden.</div>
             )}
             {filteredOrders.map(order => (
                <OrderCard 
                    key={order.id} 
                    order={order}
                    statusMap={statusMap}
                    onStatusChange={handleStatusChange}
                    onShowDetails={handleShowDetails}
                />
             ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md m-4">
          <DialogHeader>
            <DialogTitle>Bestelldetails</DialogTitle>
            <DialogDescription>
              Bestellung #{selectedOrder?.id.slice(-6)} vom{' '}
              {selectedOrder && <FormattedDate date={new Date(selectedOrder.createdAt)} formatString="dd.MM.yyyy, HH:mm" />}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Bestellübersicht</h3>
                   <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">{selectedOrder.type === 'grocery_list' ? 'Lieferung:' : 'Abholung:'}</p>
                        <p className="font-medium"><FormattedDate date={new Date(selectedOrder.pickupDate || selectedOrder.deliveryDate || selectedOrder.createdAt)} formatString="EEEE, dd.MM.yyyy" locale={de} /></p>
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
