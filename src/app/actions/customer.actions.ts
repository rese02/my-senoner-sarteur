'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { toPlainObject } from '@/lib/utils';
import type { User, Order, Product, Category } from '@/lib/types';

export async function getCustomersPageData() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const customerSnap = await adminDb.collection('users').where('role', '==', 'customer').get();
    const orderSnap = await adminDb.collection('orders').get();
    const productSnap = await adminDb.collection('products').get();
    const categorySnap = await adminDb.collection('categories').get();

    const customers = customerSnap.docs.map(d => toPlainObject({ id: d.id, ...d.data() } as User));
    const orders = orderSnap.docs.map(d => toPlainObject({ id: d.id, ...d.data() } as Order));
    const products = productSnap.docs.map(d => toPlainObject({ id: d.id, ...d.data() } as Product));
    const categories = categorySnap.docs.map(d => toPlainObject({ id: d.id, ...d.data() } as Category));

    return { customers, orders, products, categories };
  } catch (error) {
    console.error("Error fetching data for customers page:", error);
    throw new Error("Failed to load data from Firestore.");
  }
}
