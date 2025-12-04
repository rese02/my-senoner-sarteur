'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { toPlainObject } from '@/lib/utils';
import type { Order, User } from '@/lib/types';

export async function getScannerPageData() {
  const session = await getSession();
  if (!session || !['employee', 'admin'].includes(session.role)) {
    throw new Error('Unauthorized');
  }

  try {
    const usersSnapshot = await adminDb.collection('users').get();
    const groceryListsSnapshot = await adminDb
      .collection('orders')
      .where('type', '==', 'grocery_list')
      .where('status', '==', 'new')
      .get();
      
    const users = usersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as User));
    const groceryLists = groceryListsSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Order));

    return { users, groceryLists };
  } catch (error) {
    console.error("Error fetching data for scanner page:", error);
    throw new Error("Failed to load data from Firestore.");
  }
}

    