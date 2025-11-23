'use server';

import { getSession } from '@/lib/session';
import { mockOrders } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';

// NOTE: This file operates on mock data. In a real Firebase app, you would
// use the Firebase Admin SDK to perform these operations on your Firestore database.

export async function markOrderAsPaid(orderId: string) {
  const session = await getSession();
  if (!['admin', 'employee'].includes(session?.role || '')) {
    throw new Error("Nicht autorisiert!");
  }

  const orderIndex = mockOrders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    throw new Error("Bestellung nicht gefunden.");
  }

  const order = mockOrders[orderIndex];

  // Logic check: Only mark orders as paid that make sense to be paid now.
  if (order.status === 'new' || order.status === 'picking') {
       throw new Error(`Die Bestellung ist noch in Bearbeitung (Status: ${order.status}).`);
  }
   if (order.status === 'paid') {
       throw new Error(`Diese Bestellung wurde bereits bezahlt.`);
  }

  // Update the status
  mockOrders[orderIndex].status = 'paid';

  // Revalidate the paths where this data is shown
  revalidatePath(`/admin/customers/${order.userId}`);
  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');

  return { success: true, message: `Bestellung #${orderId.slice(-6)} als bezahlt markiert.` };
}

    