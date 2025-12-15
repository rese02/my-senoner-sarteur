
'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { toPlainObject } from '@/lib/utils';
import type { Order, User } from '@/lib/types';

// Strikte Berechtigungsprüfung für alle Funktionen in dieser Datei.
async function requireEmployeeOrAdmin() {
  const session = await getSession();
  if (!session || !['employee', 'admin'].includes(session.role)) {
    throw new Error('Unauthorized: Employee or Admin access required.');
  }
}

export async function getScannerPageData() {
  await requireEmployeeOrAdmin();

  try {
    // Abfragen parallel ausführen für bessere Performance
    const [usersSnapshot, groceryListsSnapshot, allOrdersSnapshot] = await Promise.all([
      adminDb.collection('users').get(),
      adminDb.collection('orders').where('type', '==', 'grocery_list').where('status', '==', 'new').get(),
      adminDb.collection('orders').get(),
    ]);
      
    const users = usersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as User));
    const groceryLists = groceryListsSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Order));
    const allOrders = allOrdersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Order));
    
    // Geben Sie alle relevanten Daten zurück
    return { users, groceryLists, allOrders };
  } catch (error) {
    console.error("Error fetching data for scanner page:", error);
    // Stabile Rückgabe im Fehlerfall
    return { users: [], groceryLists: [], allOrders: [] };
  }
}
