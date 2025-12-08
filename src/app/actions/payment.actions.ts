'use server';

import { getSession } from '@/lib/session';
import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Strikte Berechtigungsprüfung: Nur Mitarbeiter oder Admins dürfen diese Aktionen ausführen.
async function requireEmployeeOrAdmin() {
  const session = await getSession();
  if (!session || !['admin', 'employee'].includes(session.role)) {
    throw new Error("Unauthorized: Employee or Admin access required.");
  }
}

export async function markOrderAsPaid(orderId: string) {
  await requireEmployeeOrAdmin();

  // Strikte Eingabevalidierung mit Zod
  const validatedOrderId = z.string().min(1).safeParse(orderId);
  if (!validatedOrderId.success) {
    throw new Error("Ungültige Bestell-ID.");
  }
  
  const orderRef = adminDb.collection('orders').doc(validatedOrderId.data);
  const doc = await orderRef.get();

  if (!doc.exists) {
    throw new Error("Bestellung nicht gefunden.");
  }

  const order = doc.data();

  // Logik-Check: Verhindert, dass neue/unbearbeitete Bestellungen bezahlt werden.
  if (order?.status === 'new' || order?.status === 'picking') {
       throw new Error(`Die Bestellung ist noch in Bearbeitung (Status: ${order.status}).`);
  }
  // Verhindert doppelte Aktionen.
   if (order?.status === 'paid') {
       throw new Error(`Diese Bestellung wurde bereits bezahlt.`);
  }

  // Update des Status
  await orderRef.update({ status: 'paid' });

  // Revalidierung der Pfade, auf denen diese Daten angezeigt werden.
  revalidatePath(`/admin/customers/${order?.userId}`);
  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');

  return { success: true, message: `Bestellung #${validatedOrderId.data.slice(-6)} als bezahlt markiert.` };
}
