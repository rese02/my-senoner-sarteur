'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { toPlainObject } from '@/lib/utils';
import type { User, Order, Product, Category } from '@/lib/types';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function getCustomersPageData() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const customerSnap = await getDocs(query(collection(adminDb, 'users'), where('role', '==', 'customer')));
    const orderSnap = await getDocs(collection(adminDb, 'orders'));
    const productSnap = await getDocs(collection(adminDb, 'products'));
    const categorySnap = await getDocs(collection(adminDb, 'categories'));

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
