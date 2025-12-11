
import { getDashboardData } from '@/app/actions/product.actions';
import type { Recipe, Product, Story, Category } from "@/lib/types";

import { Cart } from "./_components/Cart";
import { ProductsClient } from './_components/ProductsClient';
import { Suspense } from 'react';
import Loading from './loading';
import { PageHeader } from '@/components/common/PageHeader';
import { getSession } from '@/lib/session';
import { getWheelOfFortuneDataForCustomer } from '@/app/actions/marketing.actions';

// Data fetching is now done on the server for speed and security.
async function getData() {
  const { products, categories, stories, recipe } = await getDashboardData();
  const session = await getSession();
  const wheelData = await getWheelOfFortuneDataForCustomer();
  return { products, categories, stories, recipe, session, wheelData };
}


export default async function CustomerDashboardPage() {
    const { products, categories, stories, recipe, session, wheelData } = await getData();

    const userName = session?.name?.split(' ')[0] || '';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] lg:gap-8 lg:items-start">
            
            <div className="space-y-6">
                <PageHeader title={`Hallo ${userName}!`} description="Willkommen im Paradies für Feinschmecker." />

                <Suspense fallback={<Loading />}>
                    <ProductsClient 
                        products={products}
                        categories={categories}
                        stories={stories}
                        recipe={recipe}
                        wheelData={wheelData}
                    />
                </Suspense>
            </div>
            
            <div className="hidden lg:block">
                 <div className="sticky top-6 h-[calc(100vh-4.5rem)]">
                    <Cart />
                 </div>
            </div>
        </div>
    );
}
