
import { adminDb } from '@/lib/firebase-admin';
import { toPlainObject } from '@/lib/utils';
import type { Product, Category } from '@/lib/types';
import { ProductsClient } from './client';
import { collection, getDocs, orderBy } from 'firebase/firestore';


export default async function ProductsPage() {
  const productsSnapshot = await getDocs(query(collection(adminDb, 'products'), orderBy('name')));
  const categoriesSnapshot = await getDocs(query(collection(adminDb, 'categories'), orderBy('name')));

  const products = productsSnapshot.docs.map(doc => toPlainObject({ ...doc.data(), id: doc.id } as Product));
  const categories = categoriesSnapshot.docs.map(doc => toPlainObject({ ...doc.data(), id: doc.id } as Category));

  return (
      <ProductsClient initialProducts={products} initialCategories={categories} />
  );
}
