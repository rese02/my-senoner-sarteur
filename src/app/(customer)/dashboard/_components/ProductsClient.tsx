
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
import { Card } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { STATUS_MAP } from '@/lib/types';


function OpenOrderStatus({ order }: { order: Order }) {
    const StatusIcon = STATUS_MAP[order.status]?.icon;
    return (
         <Card className="p-4 border-l-4 border-primary animate-in fade-in-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm bg-card">
            <div className="flex items-center gap-3">
                <StatusIcon className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="flex-grow">
                    <h3 className="font-semibold text-foreground">Status Ihrer Bestellung #{order.id.slice(-6)}</h3>
                    <p className="text-sm text-muted-foreground">
                        Ihre Bestellung ist <strong className="text-primary">{STATUS_MAP[order.status]?.label || 'in Bearbeitung'}</strong>.
                    </p>
                </div>
            </div>
            <Button variant="ghost" asChild className="p-0 h-auto self-end sm:self-center">
                <Link href="/dashboard/orders" className="flex items-center gap-1 text-sm text-primary">
                    Alle Bestellungen ansehen <ArrowRight className="w-4 h-4" />
                </Link>
            </Button>
        </Card>
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
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] lg:gap-8 items-start">
        {/* Main Content */}
        <div className="flex flex-col gap-8 pb-28 lg:pb-8">

            <Stories stories={stories} />
            
             {openOrder && <OpenOrderStatus order={openOrder} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wheelData && <WheelOfFortuneCard settings={wheelData} />}
                <RecipeCard recipe={recipe} />
            </div>

            {categories.map(category => {
              const categoryProducts = products.filter(p => p.categoryId === category.id && p.type === 'product');
              const categoryPackages = products.filter(p => p.categoryId === category.id && p.type === 'package');
              
              if (categoryProducts.length === 0 && categoryPackages.length === 0) return null;

              return (
                <div key={category.id}>
                  <h2 className="text-3xl font-bold mb-4 text-foreground">{category.name}</h2>
                  
                  {categoryPackages.length > 0 && (
                      <div className="grid grid-cols-1 gap-4 mb-6">
                          {categoryPackages.map((product) => (
                              <PackageCard key={product.id} product={product} />
                          ))}
                      </div>
                  )}

                  {/* Mobile: Horizontal Scroll Area */}
                  {categoryProducts.length > 0 && (
                     <div className="lg:hidden">
                        <ScrollArea className="w-full whitespace-nowrap">
                            <div className="flex w-max space-x-4 pb-4">
                                {categoryProducts.map((product) => (
                                    <div key={product.id} className="w-48">
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
                        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
        <div className="hidden lg:block lg:sticky lg:top-8 h-auto">
             <div className="h-full">
                <Cart />
             </div>
        </div>
      </div>
    );
}
