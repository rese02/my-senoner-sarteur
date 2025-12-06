'use server';

import { getSession } from '@/lib/session';
import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

async function requireEmployeeOrAdmin() {
  const session = await getSession();
  if (!session || !['admin', 'employee'].includes(session.role)) {
    throw new Error("Nicht autorisiert!");
  }
}

export async function markOrderAsPaid(orderId: string) {
  await requireEmployeeOrAdmin();

  const orderRef = adminDb.collection('orders').doc(orderId);
  const doc = await orderRef.get();

  if (!doc.exists) {
    throw new Error("Bestellung nicht gefunden.");
  }

  const order = doc.data();

  // Logic check
  if (order?.status === 'new' || order?.status === 'picking') {
       throw new Error(`Die Bestellung ist noch in Bearbeitung (Status: ${order.status}).`);
  }
   if (order?.status === 'paid') {
       throw new Error(`Diese Bestellung wurde bereits bezahlt.`);
  }

  // Update the status
  await orderRef.update({ status: 'paid' });

  // Revalidate the paths where this data is shown
  revalidatePath(`/admin/customers/${order?.userId}`);
  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');

  return { success: true, message: `Bestellung #${orderId.slice(-6)} als bezahlt markiert.` };
}
