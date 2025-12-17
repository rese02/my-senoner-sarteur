
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
    // Es werden nur offene Einkaufszettel geladen, anstatt aller Bestellungen
    const groceryListsSnapshot = await adminDb.collection('orders')
        .where('type', '==', 'grocery_list')
        .where('status', '==', 'new')
        .get();
      
    const groceryLists = groceryListsSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Order));
    
    // Wir geben nur die Daten zurück, die wirklich gebraucht werden.
    return { groceryLists };
  } catch (error) {
    console.error("Error fetching data for scanner page:", error);
    // Stabile Rückgabe im Fehlerfall
    return { groceryLists: [] };
  }
}
