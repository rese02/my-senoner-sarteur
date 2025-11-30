
import { adminDb } from '@/lib/firebase-admin';
import { toPlainObject } from '@/lib/utils';
// Falls TypeScript meckert, dass Product/Category fehlen, 
// stelle sicher, dass sie in @/lib/types definiert sind oder nimm 'any'
import type { Product, Category } from '@/lib/types'; 
import { ProductsClient } from './client';

export default async function ProductsPage() {
  // 1. Produkte laden (Mit der korrekten Admin-Syntax)
  // Admin SDK nutzt .orderBy().get(), NICHT getDocs()
  const productsSnapshot = await adminDb.collection('products').orderBy('name').get();
  
  // 2. Kategorien laden
  const categoriesSnapshot = await adminDb.collection('categories').orderBy('name').get();

  // 3. Daten waschen (toPlainObject ist hier lebenswichtig!)
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

