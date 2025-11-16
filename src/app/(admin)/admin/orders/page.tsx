'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { mockOrders, mockUsers } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const statusMap: Record<OrderStatus, string> = {
  new: 'Neu',
  ready: 'Abholbereit',
  collected: 'Abgeholt',
  cancelled: 'Storniert'
};

const FormattedDate = ({ date, formatString, locale }: { date: Date, formatString: string, locale?: Locale }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return <>{format(date, formatString, { locale })}</>;
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
        // Optimistic UI update
        const originalOrders = [...orders];
        setOrders(prevOrders => prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));

        // Mock server action
        new Promise<boolean>((resolve) => {
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% success rate
                resolve(success);
            }, 500);
        }).then(success => {
            if (success) {
                toast({
                    title: "Status aktualisiert",
                    description: `Bestellung #${orderId.slice(-6)} ist jetzt "${statusMap[newStatus]}".`
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: "Fehler",
                    description: "Status konnte nicht aktualisiert werden."
                });
                setOrders(originalOrders); // Rollback on failure
            }
        });
    });
  };

  const handleShowDetails = (order: Order) => {
    setSelectedOrder(order);
    // Mock fetching customer details
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
    <>
      <PageHeader title="Bestellungen" description="Verwalten Sie alle Vorbestellungen Ihrer Kunden." />
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <CardTitle>Alle Bestellungen</CardTitle>
             <div className="flex gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Kunde oder ID suchen..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={(value: OrderStatus | 'all') => setStatusFilter(value)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Status filtern" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Alle Status</SelectItem>
                        <SelectItem value="new">Neu</SelectItem>
                        <SelectItem value="ready">Abholbereit</SelectItem>
                        <SelectItem value="collected">Abgeholt</SelectItem>
                        <SelectItem value="cancelled">Storniert</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bestell-ID</TableHead>
                <TableHead>Bestelldatum</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Abholung</TableHead>
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
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">#{order.id.slice(-6)}</TableCell>
                  <TableCell>
                    <FormattedDate date={new Date(order.createdAt)} formatString="dd.MM.yy, HH:mm" />
                  </TableCell>
                  <TableCell className="font-medium">{order.customerName}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}</TableCell>
                  <TableCell className="text-right">€{order.total.toFixed(2)}</TableCell>
                  <TableCell>{format(new Date(order.pickupDate), "EEE, dd.MM.", { locale: de })}</TableCell>
                  <TableCell>
                    <Select 
                      value={order.status} 
                      onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-8 w-[120px] capitalize text-xs">
                         <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         {Object.keys(statusMap).map(s => (
                            <SelectItem key={s} value={s} className="capitalize text-xs">{statusMap[s as OrderStatus]}</SelectItem>
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
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bestelldetails</DialogTitle>
            <DialogDescription>
              Bestellung #{selectedOrder?.id.slice(-6)} vom{' '}
              {selectedOrder && <FormattedDate date={new Date(selectedOrder.createdAt)} formatString="dd.MM.yyyy, HH:mm" />}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-6 py-4">
              {/* Section 1: Order Details */}
              <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Bestellübersicht</h3>
                   <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">Abholung:</p>
                        <p className="font-medium">{format(new Date(selectedOrder.pickupDate), "EEEE, dd.MM.yyyy", { locale: de })}</p>
                        <p className="text-muted-foreground">Status:</p>
                        <div><Badge>{statusMap[selectedOrder.status]}</Badge></div>
                   </div>
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
                  <div className="flex justify-end font-bold text-lg">
                      Gesamt: €{selectedOrder.total.toFixed(2)}
                  </div>
              </div>
              
              {/* Section 2: Customer Details */}
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
