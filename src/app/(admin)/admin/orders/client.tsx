
'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Search, FileText, ShoppingCart, Trash2, Loader2, ListChecks, X } from "lucide-react";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteOrder, deleteMultipleOrders } from "@/app/actions/admin-cleanup.actions";
import { updateOrderStatus } from "@/app/actions/order.actions";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";


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
            if(result.success) {
                toast({ title: "Gelöscht", description: "Bestellung wurde entfernt." });
                onClose();
                router.refresh();
            } else {
                toast({ variant: "destructive", title: "Fehler", description: result.error });
            }
        });
    };

    return (
        <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-bold text-muted-foreground uppercase mb-3">Verwaltung</h3>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full md:w-auto" size="sm" disabled={isDeleting}>
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

interface OrdersClientProps {
    initialOrders: Order[];
    initialUsers: User[];
}

export function OrdersClient({ initialOrders, initialUsers }: OrdersClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customerDetails, setCustomerDetails] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  // State for bulk selection
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [isBulkDeleting, startBulkDeleteTransition] = useTransition();


  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prevOrders => prevOrders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
            toast({
                title: "Status aktualisiert",
                description: `Bestellung #${orderId.slice(-6)} ist jetzt "${statusMap[newStatus].label}".`
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Fehler",
                description: "Status konnte nicht aktualisiert werden."
            });
        }
    });
  };

  const handleShowDetails = (order: Order) => {
    if (isSelectionMode) {
      handleSelectOrder(order.id);
      return;
    }
    setSelectedOrder(order);
    const customer = users.find(u => u.id === order.userId) || null;
    setCustomerDetails(customer);
    setIsModalOpen(true);
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const customerName = order.customerName || '';
        const matchesSearch = 
          customerName.toLowerCase().includes(lowerSearchTerm) ||
          order.id.toLowerCase().includes(lowerSearchTerm);
        
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, searchTerm, statusFilter]);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked) {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };
  
  const handleBulkDelete = () => {
    startBulkDeleteTransition(async () => {
        const result = await deleteMultipleOrders(selectedOrderIds);
        if (result.success) {
            setOrders(prev => prev.filter(o => !selectedOrderIds.includes(o.id)));
            toast({ title: "Erfolg", description: `${result.count} Bestellungen gelöscht.` });
        } else {
            toast({ variant: "destructive", title: "Fehler", description: result.error });
        }
        setIsSelectionMode(false);
        setSelectedOrderIds([]);
    });
  };


  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row gap-2 w-full mb-4">
            <div className="relative w-full flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Kunde oder ID suchen..." 
                    className="pl-8 bg-card"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={statusFilter} onValueChange={(value: OrderStatus | 'all') => setStatusFilter(value)}>
                <SelectTrigger className="w-full sm:w-[180px] bg-card">
                    <SelectValue placeholder="Status filtern" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    {Object.keys(statusMap).map(s => (
                            <SelectItem key={s} value={s} className="capitalize text-xs">{statusMap[s as OrderStatus].label}</SelectItem>
                        ))}
                </SelectContent>
            </Select>
            {!isSelectionMode ? (
                <Button variant="outline" className="bg-card" onClick={() => setIsSelectionMode(true)}>
                    <ListChecks className="mr-2 h-4 w-4" /> Verwalten
                </Button>
            ) : (
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => { setIsSelectionMode(false); setSelectedOrderIds([]); }}>
                            <X className="mr-2 h-4 w-4" /> Abbrechen
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={selectedOrderIds.length === 0 || isBulkDeleting}>
                                {isBulkDeleting ? <Loader2 className="animate-spin mr-2"/> : <Trash2 className="mr-2 h-4 w-4" />}
                                Löschen ({selectedOrderIds.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                <AlertDialogDescription>Möchten Sie die {selectedOrderIds.length} ausgewählten Bestellungen wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                <AlertDialogAction onClick={handleBulkDelete} disabled={isBulkDeleting}>Ja, löschen</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
        </div>
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  {isSelectionMode && (
                      <TableHead className="w-12">
                          <Checkbox
                              checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                              onCheckedChange={handleSelectAll}
                           />
                      </TableHead>
                  )}
                  <TableHead>Bestell-ID</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Fälligkeit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isSelectionMode ? 8 : 7} className="h-24 text-center">Keine Bestellungen gefunden.</TableCell>
                  </TableRow>
                )}
                {filteredOrders.map((order) => {
                  const isGroceryList = order.type === 'grocery_list';
                  const itemCount = isGroceryList ? order.rawList?.split('\n').length : order.items?.length;
                  const isSelected = selectedOrderIds.includes(order.id);

                  return (
                  <TableRow 
                    key={order.id} 
                    data-state={isSelected ? "selected" : ""}
                    onClick={() => handleShowDetails(order)} 
                    className={cn("transition-colors", isSelectionMode ? "cursor-pointer" : "hover:bg-secondary")}
                  >
                     {isSelectionMode && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                           <Checkbox checked={isSelected} onCheckedChange={() => handleSelectOrder(order.id)} />
                        </TableCell>
                     )}
                    <TableCell className="font-mono text-xs">#{order.id.slice(-6)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         {isGroceryList
                          ? <FileText className="h-4 w-4 text-orange-500"/>
                          : <ShoppingCart className="h-4 w-4 text-primary"/>
                         }
                         <span className="text-xs">{isGroceryList ? 'Liste' : 'Vorb.'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                        {itemCount} Artikel
                        {order.total ? <span className="font-semibold text-foreground"> • €{order.total.toFixed(2)}</span> : ''}
                    </TableCell>
                    <TableCell>{format(parseISO(order.pickupDate || order.deliveryDate || order.createdAt), "EEE, dd.MM.", { locale: de })}</TableCell>
                    <TableCell>
                      <Select 
                        value={order.status} 
                        onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                        disabled={isPending}
                        onOpenChange={(open) => {
                            if (open) {
                                // This is a trick to stop event propagation so the row's onClick isn't fired when opening the select.
                                const event = new Event('dummy', { bubbles: true, cancelable: true });
                                window.dispatchEvent(event);
                                event.stopPropagation();
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SelectTrigger className="h-8 w-[140px] capitalize text-xs bg-background focus:ring-primary/50">
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
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleShowDetails(order); }}>Details</Button>
                    </TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-3 p-4">
             {filteredOrders.length === 0 && (
                <div className="text-center text-muted-foreground py-16">Keine Bestellungen gefunden.</div>
             )}
             {filteredOrders.map(order => (
                <div key={order.id} className="flex gap-2 items-center">
                    {isSelectionMode && (
                        <Checkbox 
                            checked={selectedOrderIds.includes(order.id)} 
                            onCheckedChange={() => handleSelectOrder(order.id)}
                            className="h-6 w-6"
                         />
                    )}
                    <div className="flex-1" onClick={() => handleShowDetails(order)}>
                        <OrderCard 
                            order={order}
                            onShowDetails={isSelectionMode ? undefined : () => handleShowDetails(order)}
                        />
                    </div>
                </div>
             ))}
          </div>
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

               <DialogClose asChild>
                <Button variant="outline" className="mt-4">Schließen</Button>
              </DialogClose>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
