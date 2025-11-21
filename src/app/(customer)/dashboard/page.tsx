'use client';

import { useState } from 'react';
import { mockCategories, mockProducts, mockAppConfig, mockStories } from "@/lib/mock-data";
import { ProductCard } from "./_components/ProductCard";
import { Cart } from "./_components/Cart";
import { RecipeCard } from "./_components/RecipeCard";
import type { Recipe, Product, Story } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Stories } from './_components/Stories';
import { PackageCard } from './_components/PackageCard';
import { useCartStore } from '@/hooks/use-cart-store';

function CategoryFilter({ activeCategory, onSelect }: { activeCategory: string, onSelect: (category: string) => void }) {
  const categories = ["Alle", ...mockCategories.map(c => c.name)];
  return (
    <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 px-4 md:px-0 -mx-4 md:mx-0">
        <div className="flex overflow-x-auto py-4 gap-2 scrollbar-hide px-4 md:px-0">
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => onSelect(cat)}
              variant={activeCategory === cat ? "default" : "outline"}
              className="rounded-full px-5 text-sm h-9 whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
    </div>
  );
}


export default function CustomerDashboardPage() {
    const [recipe] = useState<Recipe>(mockAppConfig.recipeOfTheWeek);
    const [stories] = useState<Story[]>(mockStories);
    const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
    const cartItems = useCartStore(state => state.items);

    const filteredProducts = selectedCategory === 'Alle'
        ? mockProducts.filter(p => p.isAvailable)
        : mockProducts.filter(p => {
            const category = mockCategories.find(c => c.name === selectedCategory);
            return p.categoryId === category?.id && p.isAvailable;
        });

    return (
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8 lg:items-start">
            <div className="lg:col-span-1">
                <div className="space-y-8">
                     <div className="overflow-hidden">
                       <Stories stories={stories} />
                    </div>
                    <div className="px-4 md:px-0">
                        <RecipeCard recipe={recipe} />
                    </div>
                    
                    <section>
                        <CategoryFilter activeCategory={selectedCategory} onSelect={setSelectedCategory} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0 mt-6">
                            {filteredProducts.map(product => {
                                if (product.type === 'package') {
                                    return <PackageCard key={product.id} product={product} />
                                }
                                return <ProductCard key={product.id} product={product} />;
                            })}
                        </div>
                    </section>
                </div>
            </div>
            
            <div className="hidden lg:block">
                 <div className="sticky top-6 h-[calc(100vh-4.5rem)]">
                    <Cart />
                 </div>
            </div>
            
            {/* Mobile Cart Button & Sheet */}
            <div className="lg:hidden fixed bottom-20 right-6 z-20">
                 <Sheet>
                    <SheetTrigger asChild>
                        <Button size="lg" className="rounded-full h-16 w-16 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground relative">
                            <ShoppingCart className="h-7 w-7" />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh] flex flex-col rounded-t-2xl p-0">
                        <Cart />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
