
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ShoppingBag, ListPlus } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCartStore } from '@/hooks/use-cart-store';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollArea } from '@/components/ui/scroll-area';


export function PackageCard({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);
  const { toast } = useToast();
  const fallbackImageUrl = PlaceHolderImages.find(p => p.id === 'placeholder-general')?.imageUrl || 'https://placehold.co/400x300';


   const handleAddToCart = () => {
        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1, // Packages are added one by one
        });
        toast({
            title: "Zum Warenkorb hinzugefügt",
            description: `1x ${product.name}`,
        });
    };

    const handleModalAddToCart = () => {
        handleAddToCart();
        setIsOpen(false);
    }

  return (
    <>
      <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full bg-card">
        <div className="grid grid-cols-[120px_1fr] items-stretch">
            {/* Left side: Image */}
            <div className="relative h-full w-full overflow-hidden">
                <Image 
                    src={product.imageUrl || fallbackImageUrl} 
                    alt={product.name} 
                    fill
                    sizes="120px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    data-ai-hint={product.imageHint}
                />
            </div>
            
            {/* Right side: Content */}
            <div className="p-4 flex flex-col justify-between h-full gap-2">
                <div>
                  <h3 className="font-headline text-lg text-foreground font-bold leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                   <p className="text-xl font-semibold text-primary mt-1">€{product.price.toFixed(2)}</p>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                    {product.description || 'Das Rundum-Sorglos-Paket für Ihren Start.'}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-end gap-2">
                     <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsOpen(true)}
                        className="rounded-full"
                      >
                        <ListPlus className="w-4 h-4 mr-2" />
                        Inhalt
                      </Button>
                     <Button size="sm" onClick={handleAddToCart} className="rounded-full">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Hinzufügen
                      </Button>
                </div>
            </div>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
            <div className="flex flex-col">
                 <div className="relative h-48 w-full">
                   <Image src={product.imageUrl || fallbackImageUrl} fill sizes="400px" className="object-cover" alt={product.name} data-ai-hint={product.imageHint} />
                </div>
                
                <div className="p-6 space-y-4">
                     <div>
                        <DialogTitle>{product.name}</DialogTitle>
                        <DialogDescription>
                          Dieses Paket enthält die folgenden Artikel.
                        </DialogDescription>
                    </div>

                    <ScrollArea className="max-h-[200px] rounded-lg">
                        <div className="p-1">
                            {product.packageContent?.map((content, index) => (
                                <div 
                                key={index} 
                                className="flex justify-between items-center py-3 border-b last:border-0"
                                >
                                <span className="text-card-foreground font-medium">{content.item}</span>
                                <span className="text-primary font-semibold">
                                    {content.amount}
                                </span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                <div className="mt-auto flex items-center justify-between bg-secondary p-4">
                  <div className="text-primary font-bold text-2xl">
                    {product.price.toFixed(2)} €
                  </div>
                  <Button className="px-8" onClick={handleModalAddToCart}>
                    In den Warenkorb
                  </Button>
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
