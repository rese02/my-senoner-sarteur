
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart-store';
import { useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/custom/DatePicker';
import { add, isBefore } from 'date-fns';
import { BUSINESS_HOURS } from '@/lib/constants';
import { createPreOrder } from '@/app/actions/order.actions';

export function Cart() {
    const { items, removeFromCart, clearCart } = useCartStore();
    const [pickupDate, setPickupDate] = useState<Date | undefined>(() => {
        return add(new Date(), { days: 1 });
    });
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleOrder = () => {
        if (!pickupDate) {
            toast({
                variant: 'destructive',
                title: 'Abholdatum fehlt',
                description: 'Bitte wählen Sie ein gültiges Abholdatum.',
            });
            return;
        }

        const earliestPickupTime = add(new Date(), { hours: BUSINESS_HOURS.minPrepTimeHours });
        if (isBefore(pickupDate, earliestPickupTime)) {
            toast({
                variant: 'destructive',
                title: 'Zu frühes Abholdatum',
                description: `Bitte wählen Sie eine Zeit, die mindestens ${BUSINESS_HOURS.minPrepTimeHours} Stunden in der Zukunft liegt.`,
            });
            return;
        }

        startTransition(async () => {
            try {
                await createPreOrder(items, pickupDate);
                toast({
                    title: 'Bestellung aufgegeben!',
                    description: 'Wir haben Ihre Vorbestellung erhalten.',
                })
                clearCart();
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Fehler',
                    description: 'Ihre Bestellung konnte nicht aufgegeben werden.',
                })
            }
        });
    };

    return (
        <Card className="shadow-lg h-full flex flex-col bg-card">
            <CardHeader className="flex-shrink-0 p-4 border-b">
                <CardTitle className="flex items-center gap-2 text-base">
                    <ShoppingCart /> Ihre Vorbestellung
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden flex flex-col p-0">
                {items.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center text-center text-muted-foreground p-4">
                        Ihr Warenkorb ist leer.
                    </div>
                ) : (
                    <ScrollArea className="flex-grow">
                        <div className="space-y-2 p-4">
                            {items.map(item => (
                                <div key={item.productId} className="flex justify-between items-center gap-2 py-2 rounded-md">
                                    <div>
                                        <p className="font-semibold text-base leading-tight">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} x €{item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <p className="font-semibold text-base text-right">€{(item.price * item.quantity).toFixed(2)}</p>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0 active:scale-95" onClick={() => removeFromCart(item.productId)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
            {items.length > 0 && (
                <CardFooter className="flex-shrink-0 flex flex-col items-stretch space-y-3 p-4 border-t bg-secondary/30">
                     <div className="space-y-1.5">
                        <label htmlFor="pickup-date" className="text-xs font-medium">Abholdatum</label>
                        <DatePicker date={pickupDate} setDate={setPickupDate} />
                     </div>
                     <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Gesamt</span>
                        <span>€{total.toFixed(2)}</span>
                    </div>
                    <Button onClick={handleOrder} disabled={isPending} size="lg">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Jetzt vorbestellen
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
