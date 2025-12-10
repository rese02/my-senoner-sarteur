'use client';

import { useState } from 'react';
import { ProductCard } from "@/components/custom/ProductCard";
import { RecipeCard } from "./RecipeCard";
import type { Recipe, Product, Story, Category } from "@/lib/types";
import { Stories } from '@/components/custom/Stories';
import { PackageCard } from "@/components/custom/PackageCard";
import { useCartStore } from '@/hooks/use-cart-store';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Cart } from "./Cart";

function CategoryFilter({ categories, activeCategory, onSelect }: { categories: Category[], activeCategory: string, onSelect: (categoryId: string) => void }) {
  return (
    <div className="py-2 bg-secondary/80 backdrop-blur-sm rounded-xl p-2 sticky top-2 z-10">
        <div className="flex overflow-x-auto gap-2 scrollbar-hide">
          <Button
              key="Alle"
              onClick={() => onSelect('Alle')}
              variant={activeCategory === 'Alle' ? "default" : "secondary"}
              className="rounded-full px-5 text-sm h-9 whitespace-nowrap shrink-0 shadow-sm"
            >
              Alle
            </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              variant={activeCategory === cat.id ? "default" : "secondary"}
              className="rounded-full px-5 text-sm h-9 whitespace-nowrap shrink-0 shadow-sm"
            >
              {cat.name}
            </Button>
          ))}
        </div>
    </div>
  );
}

interface ProductsClientProps {
    products: Product[];
    categories: Category[];
    stories: Story[];
    recipe: Recipe;
}

export function ProductsClient({ products, categories, stories, recipe }: ProductsClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
    const cartItems = useCartStore(state => state.items);

    const filteredProducts = selectedCategory === 'Alle'
        ? products
        : products.filter(p => p.categoryId === selectedCategory);

    return (
      <>
        <div className="flex flex-col gap-6 pb-28">
            <Stories stories={stories} />
            <RecipeCard recipe={recipe} />
            
            <CategoryFilter categories={categories} activeCategory={selectedCategory} onSelect={setSelectedCategory} />
            
            <div className="grid grid-cols-1 gap-4">
                {filteredProducts.map(product => {
                    if (product.type === 'package') {
                        return <PackageCard key={product.id} product={product} />
                    }
                    return <ProductCard key={product.id} product={product} />;
                })}
            </div>
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
            <SheetContent side="bottom" className="h-[80vh] flex flex-col rounded-t-2xl p-0 bg-secondary">
              <Cart />
            </SheetContent>
          </Sheet>
        </div>
      </>
    );
}
