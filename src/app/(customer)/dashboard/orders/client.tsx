
'use client';

import { deleteMyOrders, getCustomerOrders } from "@/app/actions/order.actions";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Order, OrderStatus } from "@/lib/types";
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { Package, FileText, Calendar, Trash2, Loader2, ListChecks, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useTransition, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { STATUS_MAP } from "@/lib/types";


const deletableStatuses: OrderStatus[] = ['collected', 'delivered', 'paid', 'cancelled'];

function OrderHistoryCard({ 
    order, 
    isSelectionMode, 
    isSelected, 
    onSelect 
}: { 
    order: Order; 
    isSelectionMode: boolean;
    isSelected: boolean;
    onSelect: (orderId: string) => void;
}) {
    const isGroceryList = order.type === 'grocery_list';
    const relevantDate = order.pickupDate || order.deliveryDate || order.createdAt;
    const StatusIcon = STATUS_MAP[order.status]?.icon;
    const isDeletable = deletableStatuses.includes(order.status);
    
    const handleCardClick = () => {
        if (isSelectionMode && isDeletable) {
            onSelect(order.id);
        }
    };

    return (
        <div className="flex items-start gap-3">
             {isSelectionMode && (
                <Checkbox 
                    checked={isSelected} 
                    onCheckedChange={() => onSelect(order.id)}
                    disabled={!isDeletable}
                    className="h-6 w-6 mt-5"
                    aria-label={`Bestellung ${order.id.slice(-6)} auswählen`}
                />
            )}
            <Card 
                onClick={handleCardClick} 
                className={cn(
                    "overflow-hidden shadow-sm bg-card flex-1 transition-all border-l-4",
                    STATUS_MAP[order.status]?.className.replace('bg-', 'border-').replace('-100', '-300').replace('-800', '-500'),
                    isSelectionMode && isDeletable && "cursor-pointer hover:bg-secondary",
                    isSelected && "ring-2 ring-primary border-primary"
                )}
            >
                <CardHeader className={cn("p-4")}>
                    <div className="flex flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                {isGroceryList ? <FileText className="w-4 h-4 text-orange-600" /> : <Package className="w-4 h-4 text-primary" />}
                                <span className="text-card-foreground">{isGroceryList ? 'Concierge Bestellung' : 'Vorbestellung'}</span>
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                #{order.id.slice(-6)} - {format(parseISO(order.createdAt), "dd.MM.yyyy, HH:mm")}
                            </CardDescription>
                        </div>
                        <Badge className={cn("capitalize font-semibold text-xs whitespace-nowrap", STATUS_MAP[order.status]?.className)}>
                            {StatusIcon && <StatusIcon className="w-3 h-3 mr-1.5"/>}
                            {STATUS_MAP[order.status]?.label}
                        </Badge>
                    </div>
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
                                    <div key={item.productId} className="flex justify-between items-center py-1 border-b last:border-0">
                                        <span className="text-sm font-medium">{item.quantity}x {item.productName}</span>
                                        <span className="font-mono text-muted-foreground text-sm">€{(item.price * item.quantity).toFixed(2)}</span>
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
                                <span className="text-base font-semibold text-primary">€{order.total.toFixed(2)}</span>
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
        </div>
    );
}

export function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const { toast } = useToast();
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
    const [isDeleting, startDeleteTransition] = useTransition();

    const refreshOrders = useCallback(() => {
        // This can be used to re-fetch if needed, though not required with server-side props
        getCustomerOrders()
            .then(setOrders)
            .catch(() => toast({ variant: 'destructive', title: 'Fehler', description: 'Bestellungen konnten nicht neu geladen werden.' }));
    }, [toast]);
    
    const deletableOrderIds = useMemo(() => {
        return orders.filter(o => deletableStatuses.includes(o.status)).map(o => o.id);
    }, [orders]);

    const handleSelectOrder = (orderId: string) => {
        setSelectedOrderIds(prev => 
            prev.includes(orderId) 
            ? prev.filter(id => id !== orderId)
            : [...prev, orderId]
        );
    };
    
    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked) {
            setSelectedOrderIds(deletableOrderIds);
        } else {
            setSelectedOrderIds([]);
        }
    };
    
    const handleBulkDelete = () => {
        if (selectedOrderIds.length === 0) return;
        startDeleteTransition(async () => {
            try {
                const result = await deleteMyOrders(selectedOrderIds);
                toast({ title: 'Erfolg', description: `${result.count} Bestellung(en) gelöscht.` });
                // Optimistic update
                setOrders(prev => prev.filter(o => !selectedOrderIds.includes(o.id)));
            } catch (e: any) {
                toast({ variant: 'destructive', title: 'Fehler', description: e.message });
            } finally {
                setIsSelectionMode(false);
                setSelectedOrderIds([]);
            }
        });
    };

    if (orders.length === 0) {
        return (
            <Card className="text-center py-16 text-muted-foreground border-dashed shadow-none bg-card/50">
                <Package className="mx-auto h-12 w-12 text-gray-300"/>
                <h3 className="mt-4 text-lg font-medium">Noch keine Bestellungen</h3>
                <p className="mt-1 text-sm">Ihre Bestellungen werden hier angezeigt.</p>
            </Card>
        );
    }
    
    return (
        <div className="space-y-6">
            {deletableOrderIds.length > 0 && (
                <div className="flex justify-end gap-2 items-center">
                    {!isSelectionMode ? (
                        <Button variant="outline" onClick={() => setIsSelectionMode(true)}>
                            <ListChecks className="mr-2 h-4 w-4" /> Verwalten
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => { setIsSelectionMode(false); setSelectedOrderIds([]); }}>
                                <X className="mr-2 h-4 w-4" /> Abbrechen
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={selectedOrderIds.length === 0 || isDeleting}>
                                        {isDeleting ? <Loader2 className="animate-spin mr-2"/> : <Trash2 className="mr-2 h-4 w-4" />}
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
                                        <AlertDialogAction onClick={handleBulkDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">Ja, löschen</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                </div>
            )}


            {isSelectionMode && deletableOrderIds.length > 0 && (
                 <div className="flex items-center space-x-2 p-3 bg-secondary rounded-lg border">
                    <Checkbox
                        id="select-all"
                        checked={selectedOrderIds.length > 0 && selectedOrderIds.length === deletableOrderIds.length}
                        onCheckedChange={handleSelectAll}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">
                        Alle {deletableOrderIds.length} abgeschlossenen Bestellungen auswählen
                    </label>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24 md:pb-8">
                {orders.map(order => 
                    <OrderHistoryCard 
                        key={order.id} 
                        order={order}
                        isSelectionMode={isSelectionMode}
                        isSelected={selectedOrderIds.includes(order.id)}
                        onSelect={handleSelectOrder}
                    />
                )}
            </div>
        </div>
    );
}
