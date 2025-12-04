
import { getDashboardData } from '@/app/actions/product.actions';
import type { Recipe, Product, Story, Category } from "@/lib/types";

import { Cart } from "./_components/Cart";
import { ProductsClient } from './_components/ProductsClient';

// Data fetching is now done on the server for speed and security.
async function getData() {
  const { products, categories, stories, recipe } = await getDashboardData();
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
