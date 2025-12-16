
'use server';

import { getDashboardData } from '@/app/actions/product.actions';
import { ProductsClient } from './_components/ProductsClient';
import { Suspense } from 'react';
import Loading from './loading';
import { getSession } from '@/lib/session';
import { getWheelOfFortuneDataForCustomer } from '@/app/actions/marketing.actions';

// Data fetching is now done on the server for speed and security.
async function getData() {
  const { products, categories, stories, recipe, openOrder } = await getDashboardData();
  const wheelData = await getWheelOfFortuneDataForCustomer();
  return { products, categories, stories, recipe, wheelData, openOrder };
}


export default async function CustomerDashboardPage() {
    const { products, categories, stories, recipe, wheelData, openOrder } = await getData();

    return (
        <Suspense fallback={<Loading />}>
            <ProductsClient 
                products={products}
                categories={categories}
                stories={stories}
                recipe={recipe}
                wheelData={wheelData}
                openOrder={openOrder}
            />
        </Suspense>
    );
}
