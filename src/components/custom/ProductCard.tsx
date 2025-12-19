
'use client';

import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/hooks/use-cart-store';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function ProductCard({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const { toast } = useToast();
    const addToCart = useCartStore(state => state.addToCart);
    const fallbackImageUrl = PlaceHolderImages.find(p => p.id === 'placeholder-general')?.imageUrl || 'https://placehold.co/400x300';

    const handleAddToCart = () => {
        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
        });
        toast({
            title: "Zum Warenkorb hinzugefügt",
            description: `${quantity}x ${product.name}`,
        });

        if (typeof window.navigator.vibrate === 'function') {
            window.navigator.vibrate(50);
        }
        setQuantity(1);
    };

    return (
        <Card className="overflow-hidden group transition-all duration-300 w-full h-full flex flex-col shadow-sm border bg-card">
           <div className="relative aspect-[4/3] w-full bg-muted">
                <Image 
                    src={product.imageUrl || fallbackImageUrl} 
                    alt={product.name} 
                    fill 
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105" 
                    data-ai-hint={product.imageHint} 
                />
            </div>
            <CardContent className="p-3 flex flex-col flex-grow">
                <h3 className="text-base font-bold font-headline leading-tight line-clamp-2 flex-grow whitespace-normal">{product.name}</h3>
                <div className="flex items-baseline mt-1">
                    <p className="text-lg font-semibold text-primary">€{product.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground ml-1">/ {product.unit}</p>
                </div>

                <div className="flex items-center justify-between gap-2 mt-4">
                    <div className="flex items-center gap-1 bg-secondary rounded-full p-0.5">
                        <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="active:scale-95 transition-transform h-7 w-7 rounded-full shrink-0" aria-label="Menge verringern">
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-5 text-center font-bold text-base">{quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)} className="active:scale-95 transition-transform h-7 w-7 rounded-full shrink-0" aria-label="Menge erhöhen">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                     <Button size="sm" className="rounded-full" onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Hinzufügen
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
