'use client';

import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/hooks/use-cart-store';

export function ProductCard({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const { toast } = useToast();
    const addToCart = useCartStore(state => state.addToCart);

    const handleAddToCart = () => {
        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
        });
        toast({
            title: "Added to cart",
            description: `${quantity}x ${product.name}`,
        });
        setQuantity(1);
    };

    return (
        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-md">
            <div className="relative aspect-[4/3] bg-muted">
                <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" data-ai-hint={product.imageHint} />
                {product.availabilityDay && <Badge className="absolute top-2 right-2" variant="secondary">{product.availabilityDay} only</Badge>}
            </div>
            <CardContent className="p-4">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <div className="flex items-baseline justify-between mt-2">
                    <p className="text-xl font-bold text-primary">€{product.price.toFixed(2)}</p>
                    <span className="text-sm text-muted-foreground">/ {product.unit}</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                     <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button className="flex-1 ml-2" onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
