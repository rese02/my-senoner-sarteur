
'use server';
import 'server-only';

import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import type { Order } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

/**
 * This function can be called to process automatic status updates.
 * It's designed to be triggered by an admin visiting a page, simulating a cron job.
 */
export async function processOrderStatusUpdates() {
  // This action should only be triggerable by an admin implicitly.
  const session = await getSession();
  if (session?.role !== 'admin') {
    // Silently fail if not an admin, as this is a background task.
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const now = new Date();
    const batch = adminDb.batch();
    let updatedCount = 0;

    // Get all orders that are still 'new'
    const ordersToProcessQuery = adminDb.collection('orders').where('status', '==', 'new');
    const snapshot = await ordersToProcessQuery.get();

    if (snapshot.empty) {
      return { success: true, updated: 0 };
    }

    snapshot.docs.forEach(doc => {
      const order = { id: doc.id, ...doc.data() } as Order;
      
      const dueDateString = order.pickupDate || order.deliveryDate;
      if (!dueDateString) return; // Skip if no due date

      const dueDate = new Date(dueDateString);

      // Check if the due date is today or in the past
      if (dueDate <= now) {
        let newStatus: Order['status'] | null = null;
        
        if (order.type === 'preorder') {
          newStatus = 'ready'; // Abholbereit
        } else if (order.type === 'grocery_list') {
          newStatus = 'ready_for_delivery'; // Bereit zur Lieferung
        }

        if (newStatus) {
          batch.update(doc.ref, { status: newStatus });
          updatedCount++;
        }
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      // Revalidate paths to reflect status changes everywhere
      revalidatePath('/admin/dashboard', 'page');
      revalidatePath('/admin/orders', 'page');
      revalidatePath('/dashboard', 'page'); // This covers the customer dashboard and its sub-pages
    }

    return { success: true, updated: updatedCount };

  } catch (error) {
    console.error("Error processing order status updates:", error);
    // Do not throw an error that could crash the calling page.
    return { success: false, error: 'An error occurred during processing.' };
  }
}
