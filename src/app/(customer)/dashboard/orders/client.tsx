

'use client';

import { deleteMyOrders, getCustomerOrders } from "@/app/actions/order.actions";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Order, OrderStatus } from "@/lib/types";
import { format, parseISO } from 'date-fns';
import { Package, FileText, Calendar, Trash2, Loader2, ListChecks, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useTransition, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { STATUS_MAP } from "@/lib/types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { getLang } from "@/lib/utils";


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
    const { t, dateLocale, lang } = useLanguage();
    const isGroceryList = order.type === 'grocery_list';
    const relevantDate = order.pickupDate || order.deliveryDate || order.createdAt;
    const StatusIcon = STATUS_MAP[order.status]?.icon;
    const isDeletable = deletableStatuses.includes(order.status);
    
    const handleCardClick = () => {
        if (isSelectionMode && isDeletable) {
            onSelect(order.id);
        }
    };

    const statusLabelKey = STATUS_MAP[order.status]?.label.replace('status.', '') as keyof typeof t.status;
    const statusLabel = (t.status as any)[statusLabelKey] || order.status;
    const preorderLabel = t.orders.preorder;

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
                                <span className="text-card-foreground">{isGroceryList ? t.concierge.title : preorderLabel}</span>
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                #{order.id.slice(-6)} - {format(parseISO(order.createdAt), "dd.MM.yyyy, HH:mm")}
                            </CardDescription>
                        </div>
                        <Badge className={cn("capitalize font-semibold text-xs whitespace-nowrap", STATUS_MAP[order.status]?.className)}>
                            {StatusIcon && <StatusIcon className="w-3 h-3 mr-1.5"/>}
                            {statusLabel}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0 p-4">
                    <div className="flex items-center justify-between text-sm bg-secondary p-3 rounded-md">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4"/>
                            <span>{isGroceryList ? t.concierge.deliveryDate : t.cart.pickupDate}</span>
                        </div>
                        <span className="font-bold">{format(parseISO(relevantDate), "EEEE, dd.MM.yyyy", { locale: dateLocale })}</span>
                    </div>

                    <div>
                        {order.items && order.items.length > 0 && (
                            <div className="space-y-2">
                                {order.items.map(item => (
                                    <div key={item.productId} className="flex justify-between items-center py-1 border-b last:border-0">
                                        <span className="text-sm font-medium">{item.quantity}x {getLang(item.productName, lang)}</span>
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
                                <span className="text-sm font-bold">{t.common.total}</span>
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
    const { t } = useLanguage();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const { toast } = useToast();
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
    const [isDeleting, startDeleteTransition] = useTransition();

    const refreshOrders = useCallback(() => {
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
                <h3 className="mt-4 text-lg font-medium">{t.orders.noOrders}</h3>
                <p className="mt-1 text-sm">{t.orders.noOrdersDescription}</p>
            </Card>
        );
    }
    
    return (
        <div className="space-y-6">
            {deletableOrderIds.length > 0 && (
                <div className="flex justify-end gap-2 items-center">
                    {!isSelectionMode ? (
                        <Button variant="outline" onClick={() => setIsSelectionMode(true)}>
                            <ListChecks className="mr-2 h-4 w-4" /> {t.orders.manage}
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" onClick={() => { setIsSelectionMode(false); setSelectedOrderIds([]); }}>
                                <X className="mr-2 h-4 w-4" /> {t.orders.cancel}
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={selectedOrderIds.length === 0 || isDeleting}>
                                        {isDeleting ? <Loader2 className="animate-spin mr-2"/> : <Trash2 className="mr-2 h-4 w-4" />}
                                        {t.orders.delete} ({selectedOrderIds.length})
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{t.orders.deleteConfirmTitle}</AlertDialogTitle>
                                        <AlertDialogDescription>{t.orders.deleteConfirmDescription.replace('{count}', selectedOrderIds.length.toString())}</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t.orders.cancel}</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleBulkDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">{t.orders.deleteButton}</AlertDialogAction>
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
                        {t.orders.selectAll.replace('{count}', deletableOrderIds.length.toString())}
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

    