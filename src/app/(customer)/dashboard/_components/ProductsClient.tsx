
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Truck, CheckCircle, Info, ShoppingBag, XCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

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
        <Card className="mb-8 border-primary/20 border-2 shadow-lg animate-in fade-in-50">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {order.type === 'grocery_list' ? <Truck className="w-5 h-5 text-primary"/> : <FileText className="w-5 h-5 text-primary"/>}
                    </div>
                     Status Ihrer Bestellung
                </CardTitle>
                 <CardDescription>Ihre Bestellung #{order.id.slice(-6)}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3 text-lg font-bold text-primary">
                    <StatusIcon className="w-6 h-6" />
                    <p>{statusMap[order.status]?.label || 'Unbekannt'}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                    {order.type === 'grocery_list' ? "Voraussichtliche Lieferung:" : "Bereit zur Abholung:"} <span className="font-medium">{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('de-DE', {weekday: 'long'}) : 'Bald'}</span>
                </p>
                <Link href="/dashboard/orders" className="text-sm text-primary font-bold mt-4 inline-block">
                    Alle Bestellungen ansehen &rarr;
                </Link>
            </CardContent>
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
            {openOrder && <OpenOrderStatus order={openOrder} />}

            <Stories stories={stories} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wheelData && <WheelOfFortuneCard settings={wheelData} />}
                <div className={cn(!wheelData && "md:col-span-2")}>
                  <RecipeCard recipe={recipe} />
                </div>
            </div>
            
            {categories.map(category => {
              const categoryProducts = products.filter(p => p.categoryId === category.id && p.type === 'product');
              const categoryPackages = products.filter(p => p.categoryId === category.id && p.type === 'package');
              
              if (categoryProducts.length === 0 && categoryPackages.length === 0) return null;

              return (
                <div key={category.id}>
                  <h2 className="text-2xl font-bold font-headline mb-4 text-foreground">{category.name}</h2>
                  
                  {categoryPackages.length > 0 && (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
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
                        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoryProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                   )}
                </div>
              )
            })}
        </div>
        
        {/* Desktop Cart Sidebar */}
        <div className="hidden lg:block lg:sticky lg:top-8 h-auto">
             <div className="h-full">
                <Cart />
             </div>
        </div>
      </div>
    );
}
