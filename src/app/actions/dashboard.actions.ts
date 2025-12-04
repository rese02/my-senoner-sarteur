'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { toPlainObject } from '@/lib/utils';
import type { Order, User } from '@/lib/types';

export async function getDashboardPageData() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const ordersSnapshot = await adminDb.collection('orders').get();
    const usersSnapshot = await adminDb.collection('users').get();
    
    const orders = ordersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Order));
    const users = usersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as User));
    
    return { orders, users };
  } catch (error) {
    console.error("Error fetching data for dashboard:", error);
    throw new Error("Failed to load data from Firestore.");
  }
}
    