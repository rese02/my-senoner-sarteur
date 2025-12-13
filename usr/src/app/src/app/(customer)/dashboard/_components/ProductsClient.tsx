
'use client';

import { useState } from 'react';
import type { Recipe, Product, Story, Category, WheelOfFortuneSettings } from "@/lib/types";
import { Stories } from '@/components/custom/Stories';
import { useCartStore } from '@/hooks/use-cart-store';
import { Cart } from "./Cart";
import { WheelOfFortuneCard } from './WheelOfFortuneCard';
import { RecipeCard } from './RecipeCard';
import { ProductCard } from '@/components/custom/ProductCard';
import { PackageCard } from '@/components/custom/PackageCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';


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
        <div className="flex flex-col gap-8 pb-28 lg:pb-8">
            <Stories stories={stories} />
            
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
                  <h2 className="text-2xl font-bold font-headline mb-4 text-foreground">{category.name}</h2>
                  
                  {categoryPackages.length > 0 && (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
                          {categoryPackages.map((product) => (
                              <PackageCard key={product.id} product={product} />
                          ))}
                      </div>
                  )}

                  {categoryProducts.length > 0 && (
                    <ScrollArea className="w-full whitespace-nowrap rounded-md">
                      <div className="flex w-max space-x-4 pb-4">
                        {categoryProducts.map(product => (
                          <div key={product.id} className="w-40 sm:w-48">
                            <ProductCard product={product} />
                          </div>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" className="h-2" />
                    </ScrollArea>
                  )}
                </div>
              )
            })}
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
