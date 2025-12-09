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
      <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 w-full">
        <div className="grid grid-cols-[100px_1fr] items-stretch gap-4">
            {/* Left side: Image */}
            <div className="relative h-full w-full overflow-hidden">
                <Image 
                    src={product.imageUrl || fallbackImageUrl} 
                    alt={product.name} 
                    fill
                    sizes="100px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    data-ai-hint={product.imageHint}
                />
            </div>
            
            {/* Right side: Content */}
            <div className="p-3 pr-4 flex flex-col justify-between h-full">
                <div>
                  <h3 className="font-headline text-base text-foreground font-bold leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                    {product.description || 'Das Rundum-Sorglos-Paket für Ihren Start.'}
                  </p>
                </div>

                <div className="mt-2 flex items-end justify-between">
                    <p className="text-lg font-bold text-primary">€{product.price.toFixed(2)}</p>
                    <div className="flex gap-2">
                         <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsOpen(true)}
                          >
                            <ListPlus className="w-4 h-4 mr-2" />
                            Inhalt
                          </Button>
                         <Button size="sm" onClick={handleAddToCart}>
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Kaufen
                          </Button>
                    </div>
                </div>
            </div>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>
              Dieses Paket enthält die folgenden Artikel.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="relative h-40 w-full rounded-lg overflow-hidden mb-6">
               <Image src={product.imageUrl || fallbackImageUrl} fill sizes="400px" className="object-cover" alt={product.name} data-ai-hint={product.imageHint} />
            </div>

            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Dieses Paket enthält:
            </h4>
            
            <div className="bg-secondary rounded-lg border p-1 max-h-[300px] overflow-y-auto">
              {product.packageContent?.map((content, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-3 border-b last:border-0"
                >
                  <span className="text-card-foreground font-medium">{content.item}</span>
                  <span className="text-muted-foreground text-sm bg-background px-2 py-1 rounded border">
                    {content.amount}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between bg-primary/5 p-4 rounded-lg border border-primary/10">
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
