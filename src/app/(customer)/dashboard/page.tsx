
import { adminDb } from '@/lib/firebase-admin';
import { toPlainObject } from '@/lib/utils';
import type { Recipe, Product, Story, Category } from "@/lib/types";

import { Cart } from "./_components/Cart";
import { ProductsClient } from './_components/ProductsClient';
import { mockAppConfig } from '@/lib/mock-data'; 

// Data fetching is now done on the server for speed and security.
async function getData() {
  const productsSnapshot = await adminDb.collection('products').where('isAvailable', '==', true).get();
  const categoriesSnapshot = await adminDb.collection('categories').orderBy('name').get();
  // For now, stories and recipe are still mocked, but could come from a 'content' collection
  const storiesSnapshot = await adminDb.collection('stories').limit(10).get();

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
        </div>
    );
}
