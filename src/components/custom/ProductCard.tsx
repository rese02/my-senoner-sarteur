'use client';

import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

        // Haptic feedback
        if (typeof window.navigator.vibrate === 'function') {
            window.navigator.vibrate(50);
        }

        setQuantity(1);
    };

    return (
        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full">
           <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                {/* Left side: Image */}
                <div className="relative h-full w-full bg-muted">
                    <Image 
                        src={product.imageUrl || fallbackImageUrl} 
                        alt={product.name} 
                        fill 
                        sizes="100px" 
                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                        data-ai-hint={product.imageHint} 
                    />
                    {product.availabilityDay && <Badge className="absolute top-2 right-2" variant="secondary">{product.availabilityDay} only</Badge>}
                </div>

                {/* Right side: Content */}
                <div className="p-3 pr-4 flex flex-col justify-center h-full">
                    <h3 className="text-sm font-bold font-headline leading-tight line-clamp-2">{product.name}</h3>
                    <div className="flex items-baseline justify-between mt-1">
                        <p className="text-lg font-bold text-primary">€{product.price.toFixed(2)}</p>
                        <span className="text-xs text-muted-foreground">/ {product.unit}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                        <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="active:scale-95 transition-transform h-8 w-8 rounded-full shrink-0" aria-label="Menge verringern">
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-5 text-center font-bold text-sm">{quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)} className="active:scale-95 transition-transform h-8 w-8 rounded-full shrink-0" aria-label="Menge erhöhen">
                            <Plus className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="flex-1 ml-2 active:scale-[0.98] transition-transform rounded-full h-8" onClick={handleAddToCart}>
                            <ShoppingCart className="mr-2 h-4 w-4" /> Hinzufügen
                        </Button>
                    </div>
                </div>
           </div>
        </Card>
    );
}
