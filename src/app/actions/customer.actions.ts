'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { toPlainObject } from '@/lib/utils';
import type { User, Order, Product, Category } from '@/lib/types';

async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function getCustomersPageData() {
  await requireAdmin();

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


export async function getCustomerDetails(customerId: string) {
    await requireAdmin();

    try {
        const customerSnap = await adminDb.collection('users').doc(customerId).get();
        if (!customerSnap.exists) {
            return { customer: null, orders: [] };
        }

        const ordersSnap = await adminDb.collection('orders').where('userId', '==', customerId).get();
        
        const customer = toPlainObject({ id: customerSnap.id, ...customerSnap.data() } as User);
        const orders = ordersSnap.docs.map(d => toPlainObject({ id: d.id, ...d.data() } as Order));

        return { customer, orders };
    } catch (error) {
        console.error(`Error fetching details for customer ${customerId}:`, error);
        throw new Error("Failed to load customer details.");
    }
}