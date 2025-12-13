'use client';

import { useState, useMemo, useTransition, useEffect } from 'react';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { markOrderAsPaid } from '@/app/actions/payment.actions';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';
import { getCustomerDetails } from '@/app/actions/customer.actions';
import type { Order, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function UnpaidOrderRow({ order, onMarkAsPaid, isPending }: { order: Order; onMarkAsPaid: (orderId: string) => void; isPending: boolean; }) {
    const [isSubmitting, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(() => {
            onMarkAsPaid(order.id);
        });
    };

    const isRowPending = isPending || isSubmitting;

    return (
        <div className="flex items-center justify-between p-3 border-b last:border-0">
            <div>
                <p className="font-semibold">Bestellung #{order.id.slice(-6)}</p>
                <p className="text-sm text-muted-foreground">
                    {format(new Date(order.createdAt), "dd.MM.yyyy")} - <span className="font-mono">€{order.total?.toFixed(2)}</span>
                </p>
            </div>
            <Button 
                size="sm" 
                onClick={handleClick}
                disabled={isRowPending}
            >
                 {isRowPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Als bezahlt markieren
            </Button>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="space-y-2">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full max-w-lg mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-32 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}


// Die übergeordnete Server Komponente, die Daten lädt
export default function CustomerDetailPage({ params }: { params: { id: string } }) {
    const customerId = params.id;
    const [customer, setCustomer] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPagePending, startPageTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await getCustomerDetails(customerId);
                setCustomer(data.customer);
                setOrders(data.orders);
            } catch (error) {
                toast({ variant: 'destructive', title: 'Fehler', description: "Kundendetails konnten nicht geladen werden." });
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [customerId, toast]);

    const unpaidGroceryOrders = useMemo(() => {
        return orders.filter(o => 
            o.type === 'grocery_list' &&
            o.status !== 'paid' &&
            o.status !== 'cancelled' &&
            o.total && o.total > 0
        );
    }, [orders]);

    const handleMarkAsPaid = (orderId: string) => {
        startPageTransition(async () => {
            try {
                await markOrderAsPaid(orderId);
                setOrders(prevOrders => 
                    prevOrders.map(o => o.id === orderId ? { ...o, status: 'paid' } : o)
                );
                toast({ title: 'Erfolg', description: `Bestellung #${orderId.slice(-6)} als bezahlt markiert.` });
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Fehler', description: error.message });
            }
        });
    };
    
    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!customer) {
        return (
            <div>
                <PageHeader title="Kunde nicht gefunden" />
                <p>Der Kunde mit der ID {customerId} konnte nicht gefunden werden.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                 <Button asChild variant="outline" size="icon">
                    <Link href="/admin/customers"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <PageHeader title={customer.name} description={customer.email} className="mb-0" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Offene Posten</CardTitle>
                    <CardDescription>
                        Hier sind alle Concierge-Bestellungen (Einkaufszettel), die bearbeitet, aber noch nicht als bezahlt markiert wurden.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {unpaidGroceryOrders.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            {unpaidGroceryOrders.map(order => (
                                <UnpaidOrderRow 
                                    key={order.id} 
                                    order={order}
                                    onMarkAsPaid={handleMarkAsPaid}
                                    isPending={isPagePending}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            <p>Keine offenen Posten für diesen Kunden. Sehr gut!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}