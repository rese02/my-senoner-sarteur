
'use client';

import { useState } from 'react';
import type { Recipe, Product, Story, Category, WheelOfFortuneSettings, Order, OrderStatus } from "@/lib/types";
import { Stories } from '@/components/custom/Stories';
import { useCartStore } from '@/hooks/use-cart-store';
import { Cart } from "./Cart";
import { WheelOfFortuneCard } from './WheelOfFortuneCard';
import { RecipeCard } from './RecipeCard';
import { ProductCard } from '@/components/custom/ProductCard';
import { PackageCard } from '@/components/custom/PackageCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Truck, Info, ShoppingBag, CheckCircle, XCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const statusMap: Record<OrderStatus, { label: string; icon: React.ElementType }> = {
    new: { label: 'In Bearbeitung', icon: Info },
    picking: { label: 'Wird gepackt', icon: ShoppingBag },
    ready: { label: 'Abholbereit', icon: CheckCircle },
    ready_for_delivery: { label: 'Auf dem Weg', icon: Truck },
    delivered: { label: 'Geliefert', icon: CheckCircle },
    collected: { label: 'Abgeholt', icon: CheckCircle },
    paid: { label: 'Bezahlt', icon: CheckCircle },
    cancelled: { label: 'Storniert', icon: XCircle }
};

function OpenOrderStatus({ order }: { order: Order }) {
    const StatusIcon = statusMap[order.status]?.icon || Info;
    return (
        <Alert className="mb-8 bg-secondary border-primary/20 animate-in fade-in-50">
            <Truck className="h-5 w-5 text-primary" />
            <AlertTitle className="font-bold text-primary">Ihre Bestellung #{order.id.slice(-6)} ist unterwegs!</AlertTitle>
            <AlertDescription className="text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span>Status: <strong className="text-foreground">{statusMap[order.status]?.label || 'Unbekannt'}</strong></span>
                <Button variant="link" asChild className="p-0 h-auto mt-2 sm:mt-0">
                    <Link href="/dashboard/orders">
                        Alle Bestellungen ansehen &rarr;
                    </Link>
                </Button>
            </AlertDescription>
        </Alert>
    )
}

interface ProductsClientProps {
    products: Product[];
    categories: Category[];
    stories: Story[];
    recipe: Recipe;
    wheelData: WheelOfFortuneSettings | null;
    openOrder: Order | null;
}

export function ProductsClient({ products, categories, stories, recipe, wheelData, openOrder }: ProductsClientProps) {
    const cartItems = useCartStore(state => state.items);

    return (
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_380px] md:gap-8 items-start">
        {/* Main Content */}
        <div className="flex flex-col gap-8 pb-28 md:pb-8">

            <Stories stories={stories} />
            
            <div className="grid grid-cols-1 gap-6">
                {wheelData && <WheelOfFortuneCard settings={wheelData} />}
                <RecipeCard recipe={recipe} />
            </div>

            {openOrder && <OpenOrderStatus order={openOrder} />}
            
            {categories.map(category => {
              const categoryProducts = products.filter(p => p.categoryId === category.id && p.type === 'product');
              const categoryPackages = products.filter(p => p.categoryId === category.id && p.type === 'package');
              
              if (categoryProducts.length === 0 && categoryPackages.length === 0) return null;

              return (
                <div key={category.id}>
                  <h2 className="text-2xl font-bold font-headline mb-4 text-foreground">{category.name}</h2>
                  
                  {categoryPackages.length > 0 && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                          {categoryPackages.map((product) => (
                              <PackageCard key={product.id} product={product} />
                          ))}
                      </div>
                  )}

                  {/* Mobile: Horizontal Scroll Area */}
                  {categoryProducts.length > 0 && (
                     <div className="md:hidden">
                        <ScrollArea className="w-full whitespace-nowrap">
                            <div className="flex w-max space-x-4 pb-4">
                                {categoryProducts.map((product) => (
                                    <div key={product.id} className="w-40">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="invisible" />
                        </ScrollArea>
                    </div>
                  )}

                  {/* Desktop: Grid Layout */}
                   {categoryProducts.length > 0 && (
                        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {categoryProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                   )}
                </div>
              )
            })}
        </div>
        
        {/* Tablet & Desktop Cart Sidebar */}
        <div className="hidden md:block md:sticky md:top-8 h-auto">
             <div className="h-full">
                <Cart />
             </div>
        </div>
      </div>
    );
}
