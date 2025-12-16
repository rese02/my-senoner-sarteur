
'use server';
import 'server-only';

import { getSession } from '@/lib/session';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { toPlainObject } from '@/lib/utils';
import type { Order } from '@/lib/types';
import { z } from 'zod';


// Strikte Berechtigungsprüfung: Nur Admins dürfen diese Aktionen ausführen.
async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error("Unauthorized: Admin access required.");
  }
}

// 1. Einzelne Bestellung löschen
export async function deleteOrder(orderId: string) {
  await requireAdmin();

  // Strikte Eingabevalidierung mit Zod
  const validatedOrderId = z.string().min(1).safeParse(orderId);
  if (!validatedOrderId.success) {
    return { success: false, error: "Ungültige Bestell-ID." };
  }

  const orderRef = adminDb.collection('orders').doc(validatedOrderId.data);
  const doc = await orderRef.get();

  if (!doc.exists) {
    return { success: false, error: "Bestellung nicht gefunden." };
  }

  await orderRef.delete();
  
  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');

  return { success: true };
}

// NEU: Mehrere Bestellungen löschen
export async function deleteMultipleOrders(orderIds: string[]) {
    await requireAdmin();

    const validatedOrderIds = z.array(z.string().min(1)).safeParse(orderIds);
    if (!validatedOrderIds.success || validatedOrderIds.data.length === 0) {
        return { success: false, error: "Keine gültigen Bestell-IDs zum Löschen angegeben." };
    }

    const batch = adminDb.batch();
    validatedOrderIds.data.forEach(id => {
        const docRef = adminDb.collection('orders').doc(id);
        batch.delete(docRef);
    });

    await batch.commit();

    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard');

    return { success: true, count: validatedOrderIds.data.length };
}


// 2. Massen-Löschen: Bestellungen älter als X Monate
export async function deleteOldOrders(months: number) {
  await requireAdmin();

  // Strikte Eingabevalidierung mit Zod
  const validatedMonths = z.number().int().positive().safeParse(months);
  if (!validatedMonths.success) {
      return { success: false, error: "Ungültiger Zeitraum." };
  }

  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - validatedMonths.data);

  // WICHTIGE ANPASSUNG: Nur abgeschlossene Bestellungen löschen
  const completedStatuses = ['collected', 'cancelled', 'delivered', 'paid'];
  
  const oldOrdersQuery = adminDb.collection('orders')
      .where('createdAt', '<', cutoffDate.toISOString())
      .where('status', 'in', completedStatuses);

  const snapshot = await oldOrdersQuery.get();

  if (snapshot.empty) {
      return { count: 0, success: true };
  }

  const batch = adminDb.batch();
  snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
  });

  await batch.commit();

  revalidatePath('/admin/orders');
  revalidatePath('/admin/settings');
  revalidatePath('/admin/dashboard');
  
  return { count: snapshot.size, success: true };
}


export async function deleteInactiveUsers() {
    await requireAdmin();

    const months = 12; // Festgelegt auf 1 Jahr Inaktivität

    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);

    // Query for users who have not logged in since the cutoff date
    // Note: Firestore might require an index for this query.
    const inactiveUsersQuery = adminDb.collection('users')
        .where('lastLogin', '<', cutoffDate.toISOString());

    const snapshot = await inactiveUsersQuery.get();

    if (snapshot.empty) {
        return { count: 0, success: true };
    }

    const uidsToDelete = snapshot.docs.map(doc => doc.id);
    let deletedOrdersCount = 0;

    // Batch-Löschung aus Firestore
    const firestoreBatch = adminDb.batch();
    
    for (const uid of uidsToDelete) {
        // 1. Alle Bestellungen des Benutzers zum Batch hinzufügen
        const ordersQuery = adminDb.collection('orders').where('userId', '==', uid);
        const ordersSnapshot = await ordersQuery.get();
        ordersSnapshot.forEach(doc => {
            firestoreBatch.delete(doc.ref);
            deletedOrdersCount++;
        });

        // 2. Das Benutzerdokument selbst zum Batch hinzufügen
        const userRef = adminDb.collection('users').doc(uid);
        firestoreBatch.delete(userRef);
    }
    
    // 3. Alle Firestore-Dokumente löschen
    await firestoreBatch.commit();
    
    // 4. Benutzer aus Firebase Authentication löschen (kann in Batches bis zu 1000)
    await adminAuth.deleteUsers(uidsToDelete);


    revalidatePath('/admin/customers');
    revalidatePath('/admin/settings');
    revalidatePath('/admin/dashboard');

    return { count: snapshot.size, success: true };
}
