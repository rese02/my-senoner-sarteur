
import { adminDb } from '@/lib/firebase-admin';
import { toPlainObject } from '@/lib/utils';
import type { Recipe, Product, Story, Category } from "@/lib/types";

import { ProductCard } from "./_components/ProductCard";
import { Cart } from "./_components/Cart";
import { RecipeCard } from "./_components/RecipeCard";
import { ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Stories } from './_components/Stories';
import { PackageCard } from './_components/PackageCard';
import { ProductsClient } from './_components/ProductsClient';
import { mockAppConfig, mockStories } from '@/lib/mock-data'; // keep for recipe/stories

async function getData() {
  const productsSnapshot = await adminDb.collection('products').where('isAvailable', '==', true).get();
  const categoriesSnapshot = await adminDb.collection('categories').orderBy('name').get();
  const storiesSnapshot = await adminDb.collection('stories').get();

  const products = productsSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Product));
  const categories = categoriesSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Category));
  const stories = storiesSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Story));
  
  // For now, we still get recipe from mock-data, but this could also come from Firestore.
  const recipe = mockAppConfig.recipeOfTheWeek;

  return { products, categories, stories, recipe };
}


export default async function CustomerDashboardPage() {
    const { products, categories, stories, recipe } = await getData();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] lg:gap-8 lg:items-start">
            
            <ProductsClient 
                products={products}
                categories={categories}
                stories={stories}
                recipe={recipe}
            />
            
            <div className="hidden lg:block">
                 <div className="sticky top-6 h-[calc(100vh-4.5rem)]">
                    <Cart />
                 </div>
            </div>

            <div className="lg:hidden fixed bottom-[5.5rem] right-4 z-20">
              <Sheet>
                  <SheetTrigger asChild>
                      <Button size="lg" className="rounded-full h-16 w-16 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground relative">
                          <ShoppingCart className="h-7 w-7" />
                           {/* Client component needed for cart count */}
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
