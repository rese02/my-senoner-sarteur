
'use client';

import { useState } from 'react';
import type { Recipe, Product, Story, Category, WheelOfFortuneSettings } from "@/lib/types";
import { Stories } from '@/components/custom/Stories';
import { useCartStore } from '@/hooks/use-cart-store';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Cart } from "./Cart";
import { WheelOfFortuneCard } from './WheelOfFortuneCard';
import { RecipeCard } from './RecipeCard';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function ProductGridCard({ product }: { product: Product }) {
  const fallbackImageUrl = PlaceHolderImages.find(p => p.id === 'placeholder-general')?.imageUrl || 'https://placehold.co/400x300';
  const { addToCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden group shadow-lg cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.99]">
      <Image 
        src={product.imageUrl || fallbackImageUrl} 
        alt={product.name} 
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        data-ai-hint={product.imageHint}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white flex justify-between items-end">
        <h3 className="font-headline text-lg font-bold leading-tight drop-shadow-md">{product.name}</h3>
        <Button size="icon" className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm text-white shrink-0" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface ProductsClientProps {
    products: Product[];
    categories: Category[];
    stories: Story[];
    recipe: Recipe;
    wheelData: WheelOfFortuneSettings | null;
}

export function ProductsClient({ products, categories, stories, recipe, wheelData }: ProductsClientProps) {
    const cartItems = useCartStore(state => state.items);

    return (
      <>
        <div className="flex flex-col gap-8 pb-28">
            <Stories stories={stories} />
            
            {wheelData && <WheelOfFortuneCard settings={wheelData} />}
            
            {categories.map(category => {
              const categoryProducts = products.filter(p => p.categoryId === category.id);
              if (categoryProducts.length === 0) return null;
              return (
                <div key={category.id}>
                  <h2 className="text-2xl font-bold font-headline mb-4 text-foreground">{category.name}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {categoryProducts.map(product => (
                      <ProductGridCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )
            })}
        </div>

        {/* Floating Cart Button for mobile */}
        <div className="lg:hidden fixed bottom-20 right-4 z-20">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full h-16 w-16 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground relative">
                <ShoppingCart className="h-7 w-7" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold animate-in zoom-in-50">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] flex flex-col rounded-t-2xl p-0 bg-background">
              <Cart />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Cart */}
        <div className="hidden lg:block fixed right-8 top-[100px] w-[380px]">
             <div className="sticky top-6 h-[calc(100vh-4.5rem)]">
                <Cart />
             </div>
        </div>
      </>
    );
}
