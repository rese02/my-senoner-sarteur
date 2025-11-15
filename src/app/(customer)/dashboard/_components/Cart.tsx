'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '@/hooks/use-cart-store';
import { useState } from 'react';

export function Cart() {
    const { items, removeFromCart, clearCart } = useCartStore();
    const [pickupDate, setPickupDate] = useState<string>(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleOrder = () => {
        // Here we would call a server action `placeOrder`
        console.log("Placing order for:", { items, total, pickupDate });
        clearCart();
        alert('Order placed successfully! (mock)');
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingCart /> Your Pre-Order
                </CardTitle>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        Your cart is empty.
                    </div>
                ) : (
                    <ScrollArea className="h-64 pr-4">
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.productId} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} x €{item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFromCart(item.productId)}>
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
                <CardFooter className="flex flex-col items-stretch space-y-4">
                     <Separator />
                     <div className="space-y-2">
                        <label htmlFor="pickup-date" className="text-sm font-medium">Pickup Date</label>
                        <Input id="pickup-date" type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}/>
                     </div>
                     <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>€{total.toFixed(2)}</span>
                    </div>
                    <Button size="lg" onClick={handleOrder}>
                        Place Pre-Order Now
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
