
'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { toPlainObject } from '@/lib/utils';
import type { User, Order, Product, Category } from '@/lib/types';
import { z } from 'zod';

// Helper for strict role checks
async function requireRole(roles: Array<'customer' | 'employee' | 'admin'>) {
    const session = await getSession();
    if (!session || !roles.includes(session.role)) {
        throw new Error('Unauthorized');
    }
    return session;
}

// Strikte Berechtigungsprüfung: Nur Admins dürfen diese Aktionen ausführen.
async function requireAdmin() {
    return requireRole(['admin']);
}

// NEU: Berechtigungsprüfung für Mitarbeiter oder Admins
async function requireEmployeeOrAdmin() {
    return requireRole(['employee', 'admin']);
}


export async function getCustomersPageData() {
  await requireAdmin();

  try {
    const customerSnap = await adminDb.collection('users').where('role', '==', 'customer').get();
    const orderSnap = await adminDb.collection('orders').get();
    const productSnap = await adminDb.collection('products').get();
    const categorySnap = await adminDb.collection('categories').get();

    const customers = customerSnap.docs.map(d => toPlainObject({ id: d.id, ...d.data() } as User));
    const orders = orderSnap.docs.map(d => toPlainObject({ id: d.id, ...d.data() } as Order));
    const products = productSnap.docs.map(d => toPlainObject({ id: d.id, ...d.data() } as Product));
    const categories = categorySnap.docs.map(d => toPlainObject({ id: d.id, ...d.data() } as Category));

    return { customers, orders, products, categories };
  } catch (error) {
    console.error("Error fetching data for customers page:", error);
    // Stabile Rückgabe im Fehlerfall, um UI-Abstürze zu verhindern.
    return { customers: [], orders: [], products: [], categories: [] };
  }
}


export async function getCustomerDetails(customerId: string) {
    // Mitarbeiter dürfen Kundendetails für den Scanner abrufen
    await requireEmployeeOrAdmin();

    // Strikte Eingabevalidierung mit Zod
    const validatedCustomerId = z.string().min(1).safeParse(customerId);
    if (!validatedCustomerId.success) {
      return { customer: null, orders: [] };
    }

    try {
        const customerSnap = await adminDb.collection('users').doc(validatedCustomerId.data).get();
        if (!customerSnap.exists) {
            return { customer: null, orders: [] };
        }

        const ordersSnap = await adminDb.collection('orders').where('userId', '==', validatedCustomerId.data).get();
        
        const customer = toPlainObject({ id: customerSnap.id, ...customerSnap.data() } as User);
        const orders = ordersSnap.docs.map(d => toPlainObject({ id: d.id, ...d.data() } as Order));

        return { customer, orders };
    } catch (error) {
        console.error(`Error fetching details for customer ${customerId}:`, error);
        return { customer: null, orders: [] };
    }
}
