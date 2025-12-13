
'use client';

import { useState } from 'react';
import type { Recipe, Product, Story, Category, WheelOfFortuneSettings } from "@/lib/types";
import { Stories } from '@/components/custom/Stories';
import { useCartStore } from '@/hooks/use-cart-store';
import { Cart } from "./Cart";
import { WheelOfFortuneCard } from './WheelOfFortuneCard';
import { RecipeCard } from './RecipeCard';
import { ProductCard } from '@/components/custom/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PackageCard } from '@/components/custom/PackageCard';

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
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] lg:gap-8 items-start">
        {/* Main Content */}
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
                    <div className="md:hidden">
                        <Carousel opts={{ align: "start", loop: false, }} className="w-full">
                            <CarouselContent className="-ml-2">
                                {categoryProducts.map((product) => (
                                <CarouselItem key={product.id} className="basis-1/2 pl-2">
                                    <ProductCard product={product} />
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>
                  )}

                   {categoryProducts.length > 0 && (
                        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
