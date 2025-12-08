'use client';

import { useState, useMemo, useTransition, useEffect } from 'react';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockUsers, mockOrders } from "@/lib/mock-data";
import type { User, Order } from "@/lib/types";
import { markOrderAsPaid } from '@/app/actions/payment.actions';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';
import { use } from 'react';

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

export default function CustomerDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    // Use React.use to resolve the promise on the server and get params directly
    const params = use(paramsPromise);

    const customerId = params?.id;
    const [isPagePending, startPageTransition] = useTransition();
    const { toast } = useToast();

    // Use a state for orders to reflect changes immediately
    const [customerOrders, setCustomerOrders] = useState(() => mockOrders.filter(o => o.userId === customerId));

     useEffect(() => {
        if (customerId) {
            setCustomerOrders(mockOrders.filter(o => o.userId === customerId));
        }
    }, [customerId]);

    const customer = useMemo(() => {
        if (!customerId) return null;
        return mockUsers.find(u => u.id === customerId);
    }, [customerId]);
    
    const unpaidGroceryOrders = useMemo(() => {
        return customerOrders.filter(o => 
            o.type === 'grocery_list' &&
            o.status !== 'paid' &&
            o.status !== 'cancelled' &&
            o.total && o.total > 0
        );
    }, [customerOrders]);

    const handleMarkAsPaid = (orderId: string) => {
        startPageTransition(async () => {
            try {
                await markOrderAsPaid(orderId);
                // Update the local state to reflect the change
                setCustomerOrders(prevOrders => 
                    prevOrders.map(o => o.id === orderId ? { ...o, status: 'paid' } : o)
                );
                toast({ title: 'Erfolg', description: `Bestellung #${orderId.slice(-6)} als bezahlt markiert.` });
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Fehler', description: error.message });
            }
        });
    };

    if (!params) {
        return (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
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
