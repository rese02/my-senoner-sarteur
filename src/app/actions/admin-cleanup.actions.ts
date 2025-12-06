'use server';

import { getSession } from '@/lib/session';
import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { toPlainObject } from '@/lib/utils';
import type { Order } from '@/lib/types';


async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error("Unauthorized: Admin access required.");
  }
}

// 1. Einzelne Bestellung löschen
export async function deleteOrder(orderId: string) {
  await requireAdmin();

  const orderRef = adminDb.collection('orders').doc(orderId);
  const doc = await orderRef.get();

  if (!doc.exists) {
    return { success: false, error: "Bestellung nicht gefunden." };
  }

  await orderRef.delete();
  
  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');

  return { success: true };
}

// 2. Massen-Löschen: Bestellungen älter als X Monate
export async function deleteOldOrders(months: number) {
  await requireAdmin();

  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  const completedStatuses = ['collected', 'cancelled', 'delivered', 'paid'];
  
  const oldOrdersQuery = adminDb.collection('orders')
      .where('createdAt', '<', cutoffDate.toISOString())
      .where('status', 'in', completedStatuses);

  const snapshot = await oldOrdersQuery.get();

  if (snapshot.empty) {
      return { count: 0 };
  }

  const batch = adminDb.batch();
  snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
  });

  await batch.commit();

  revalidatePath('/admin/orders');
  revalidatePath('/admin/settings');
  revalidatePath('/admin/dashboard');
  
  return { count: snapshot.size };
}
