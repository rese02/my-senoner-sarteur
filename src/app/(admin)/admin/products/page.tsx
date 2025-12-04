
import { adminDb } from '@/lib/firebase-admin';
import { toPlainObject } from '@/lib/utils';
import type { Product, Category } from '@/lib/types'; 
import { ProductsClient } from './client';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const productsSnapshot = await adminDb.collection('products').orderBy('name').get();
  const categoriesSnapshot = await adminDb.collection('categories').orderBy('name').get();

  const products = productsSnapshot.docs.map(doc => 
    toPlainObject({ ...doc.data(), id: doc.id } as Product)
  );

  const categories = categoriesSnapshot.docs.map(doc => 
    toPlainObject({ ...doc.data(), id: doc.id } as Category)
  );

  return (
      <ProductsClient initialProducts={products} initialCategories={categories} />
  );
}
