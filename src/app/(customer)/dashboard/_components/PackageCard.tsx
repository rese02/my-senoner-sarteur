'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingBag, ListPlus, Check } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCartStore } from '@/hooks/use-cart-store';
import { useToast } from '@/hooks/use-toast';

export function PackageCard({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);
  const { toast } = useToast();

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
      <Card className="h-full flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Bild Bereich */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={product.imageUrl} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            data-ai-hint={product.imageHint}
          />
          {/* Badge für Paket */}
          <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded shadow-sm">
            PAKET
          </div>
        </div>

        {/* Inhalt */}
        <CardHeader className="p-4 pb-2">
          <h3 className="font-headline text-xl text-foreground font-bold leading-tight">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {product.description || 'Das Rundum-Sorglos-Paket für Ihren Start.'}
          </p>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-grow">
          {/* Vorschau der ersten 2 Items */}
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {product.packageContent?.slice(0, 2).map((content, i) => (
              <li key={i} className="flex items-center">
                <Check className="w-3 h-3 text-primary mr-2" /> 
                {content.amount} {content.item}
              </li>
            ))}
            {product.packageContent && product.packageContent.length > 2 && (
              <li className="text-xs text-muted-foreground pl-5">
                + {product.packageContent.length - 2} weitere Produkte
              </li>
            )}
          </ul>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex flex-wrap sm:flex-nowrap gap-2 mt-auto">
          {/* BUTTON 1: Details (Öffnet Modal) */}
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-1/2"
          >
            <ListPlus className="w-4 h-4 mr-2" />
            Inhalt
          </Button>

          {/* BUTTON 2: Kaufen */}
          <Button className="w-full sm:w-1/2" onClick={handleAddToCart}>
            <ShoppingBag className="w-4 h-4 mr-2" />
            {product.price.toFixed(2)} €
          </Button>
        </CardFooter>
      </Card>

      {/* DAS MODAL (Detailansicht) */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-primary">
              {product.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="relative h-40 w-full rounded-lg overflow-hidden mb-6">
               <Image src={product.imageUrl} fill sizes="400px" className="object-cover" alt={product.name} data-ai-hint={product.imageHint} />
            </div>

            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
              Dieses Paket enthält:
            </h4>
            
            {/* Die vollständige Liste */}
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
