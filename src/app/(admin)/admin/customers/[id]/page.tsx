'use client';

import { useState, useMemo, useTransition, useEffect, use } from 'react';
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

// Die Client Komponente, die die Daten darstellt
function CustomerDetailClient({ customerId, initialData }: { customerId: string, initialData: { customer: User | null, orders: Order[] } }) {
    const [customer, setCustomer] = useState<User | null>(initialData.customer);
    const [orders, setOrders] = useState<Order[]>(initialData.orders);
    const [isPagePending, startPageTransition] = useTransition();
    const { toast } = useToast();

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

// Die übergeordnete Server Komponente, die Daten lädt
export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getCustomerDetails(id);

    if (!data.customer) {
        return (
            <div>
                <PageHeader title="Kunde nicht gefunden" />
                <p>Der Kunde mit der ID {id} konnte nicht gefunden werden.</p>
            </div>
        );
    }

    return <CustomerDetailClient customerId={id} initialData={data} />;
}
