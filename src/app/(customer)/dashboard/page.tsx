
'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/common/PageHeader";
import { mockCategories, mockProducts, mockAppConfig, mockStories } from "@/lib/mock-data";
import { ProductCard } from "./_components/ProductCard";
import { Cart } from "./_components/Cart";
import { RecipeCard } from "./_components/RecipeCard";
import type { Recipe, Product, Story } from "@/lib/types";
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Stories } from './_components/Stories';

function CategoryFilter({ activeCategory, onSelect }: { activeCategory: string, onSelect: (category: string) => void }) {
  const categories = ["Alle", ...mockCategories.map(c => c.name)];
  return (
    <div className="flex overflow-x-auto pb-4 gap-2 mb-6 -mx-4 px-4 scrollbar-hide">
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
  );
}


export default function CustomerDashboardPage() {
    const [recipe] = useState<Recipe>(mockAppConfig.recipeOfTheWeek);
    const [stories] = useState<Story[]>(mockStories);
    const [selectedCategory, setSelectedCategory] = useState<string>('Alle');

    const filteredProducts = selectedCategory === 'Alle'
        ? mockProducts.filter(p => p.isAvailable)
        : mockProducts.filter(p => {
            const category = mockCategories.find(c => c.name === selectedCategory);
            return p.categoryId === category?.id && p.isAvailable;
        });

    return (
        <div className="lg:container lg:mx-auto lg:p-0">
             <div className="hidden md:block">
                <PageHeader title="Pre-Order Specials" description="Bestellen Sie Ihre Lieblingsartikel im Voraus." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <div className="space-y-8">
                         <div className="px-4 md:px-0">
                           <Stories stories={stories} />
                        </div>
                        <div className="px-4 md:px-0">
                            <RecipeCard recipe={recipe} />
                        </div>
                        
                        <section>
                            <div className="px-4 md:px-0">
                                <h2 className="text-2xl font-bold mb-4 font-headline">Produkte</h2>
                                <CategoryFilter activeCategory={selectedCategory} onSelect={setSelectedCategory} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-0">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
                
                <div className="hidden lg:block">
                     <div className="sticky top-24">
                        <Cart />
                     </div>
                </div>
            </div>
            
            {/* Mobile Cart Button & Sheet */}
            <div className="lg:hidden fixed bottom-24 right-6 z-20">
                 <Sheet>
                    <SheetTrigger asChild>
                        <Button size="lg" className="rounded-full h-16 w-16 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                            <ShoppingCart className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh] flex flex-col rounded-t-lg p-0">
                        <Cart />
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
