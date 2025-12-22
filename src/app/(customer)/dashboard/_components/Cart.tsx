
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
import { useLanguage } from '@/components/providers/LanguageProvider';
import { getLang } from '@/lib/utils';

export function Cart() {
    const { items, removeFromCart, clearCart } = useCartStore();
    const { t, lang } = useLanguage();
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
                title: t.cart.toast.dateMissingTitle,
                description: t.cart.toast.dateMissingDescription,
            });
            return;
        }

        const earliestPickupTime = add(new Date(), { hours: BUSINESS_HOURS.minPrepTimeHours });
        if (isBefore(pickupDate, earliestPickupTime)) {
            toast({
                variant: 'destructive',
                title: t.cart.toast.dateTooSoonTitle,
                description: t.cart.toast.dateTooSoonDescription.replace('{hours}', BUSINESS_HOURS.minPrepTimeHours.toString()),
            });
            return;
        }

        startTransition(async () => {
            try {
                await createPreOrder(items, pickupDate);
                toast({
                    title: t.cart.toast.successTitle,
                    description: t.cart.toast.successDescription,
                })
                clearCart();
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: t.cart.toast.errorTitle,
                    description: t.cart.toast.errorDescription,
                })
            }
        });
    };

    return (
        <Card className="shadow-lg h-full flex flex-col bg-card">
            <CardHeader className="flex-shrink-0 p-4 border-b">
                <CardTitle className="flex items-center gap-2 text-base">
                    <ShoppingCart /> {t.cart.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden flex flex-col p-0">
                {items.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center text-center text-muted-foreground p-4">
                        {t.cart.empty}
                    </div>
                ) : (
                    <ScrollArea className="flex-grow">
                        <div className="space-y-2 p-4">
                            {items.map(item => (
                                <div key={item.productId} className="flex justify-between items-center gap-2 py-2 rounded-md">
                                    <div>
                                        <p className="font-semibold text-sm leading-tight">{getLang(item.name, lang)}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} x €{item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <p className="font-semibold text-sm text-right">€{(item.price * item.quantity).toFixed(2)}</p>
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
                        <label htmlFor="pickup-date" className="text-xs font-medium">{t.cart.pickupDate}</label>
                        <DatePicker date={pickupDate} setDate={setPickupDate} />
                     </div>
                     <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>{t.cart.total}</span>
                        <span>€{total.toFixed(2)}</span>
                    </div>
                    <Button onClick={handleOrder} disabled={isPending} size="lg">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t.cart.orderButton}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
