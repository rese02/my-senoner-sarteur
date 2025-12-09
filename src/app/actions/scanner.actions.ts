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
    // Holen Sie sich alle Benutzer und alle Bestellungen auf einmal
    const usersSnapshot = await adminDb.collection('users').get();
    const ordersSnapshot = await adminDb.collection('orders').get();
      
    const users = usersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as User));
    const orders = ordersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Order));
    
    // Filtern Sie die Einkaufslisten serverseitig
    const groceryLists = orders.filter(order => order.type === 'grocery_list' && order.status === 'new');

    // Geben Sie alle relevanten Daten zurück
    return { users, orders, groceryLists };
  } catch (error) {
    console.error("Error fetching data for scanner page:", error);
    // Stabile Rückgabe im Fehlerfall
    return { users: [], orders: [], groceryLists: [] };
  }
}
