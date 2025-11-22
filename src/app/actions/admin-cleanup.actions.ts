'use server';

import { getSession } from '@/lib/session';
import { mockOrders } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';

// NOTE: This file operates on mock data. In a real Firebase app, you would
// use the Firebase Admin SDK to perform these operations on your Firestore database.

// 1. Einzelne Bestellung löschen
export async function deleteOrder(orderId: string) {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Nicht autorisiert!");

  const orderIndex = mockOrders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    throw new Error("Bestellung nicht gefunden.");
  }

  mockOrders.splice(orderIndex, 1);
  revalidatePath('/admin/orders');
  return { success: true };
}

// 2. Massen-Löschen: Bestellungen älter als X Monate
export async function deleteOldOrders(months: number) {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Nicht autorisiert!");

  // Berechne das Datum: Heute minus X Monate
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  let deletedCount = 0;
  const ordersToKeep = mockOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const isOld = orderDate < cutoffDate;
    const isCompleted = ['collected', 'cancelled', 'delivered'].includes(order.status);
    
    if (isOld && isCompleted) {
        deletedCount++;
        return false; // Don't keep this order
    }
    return true; // Keep this order
  });

  // Replace the mock data array with the filtered one
  mockOrders.length = 0;
  Array.prototype.push.apply(mockOrders, ordersToKeep);

  revalidatePath('/admin/orders');
  revalidatePath('/admin/settings');
  
  return { count: deletedCount };
}
