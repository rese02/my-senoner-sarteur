'use server';

import { getSession } from '@/lib/session';
import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { CartItem, Order, User, ChecklistItem, OrderStatus } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';

export async function createPreOrder(
  items: CartItem[],
  pickupDate: Date
) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Not authenticated');
  }

  if (items.length === 0) {
    throw new Error('Cart is empty');
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderData = {
    userId: session.userId,
    customerName: session.name,
    createdAt: new Date().toISOString(),
    type: 'preorder' as const,
    items: items.map(item => toPlainObject(item)),
    pickupDate: pickupDate.toISOString(),
    total,
    status: 'new' as const,
  };

  await adminDb.collection('orders').add(orderData);

  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');
  revalidatePath('/employee/scanner');
  revalidatePath('/dashboard/orders');
}


export async function createConciergeOrder(
  notes: string,
  address: { street: string; city: string }
) {
    const session = await getSession();
    if (!session?.userId) {
        throw new Error('Not authenticated');
    }

    if (!notes.trim()) {
        throw new Error('Notes are empty');
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    deliveryDate.setHours(11, 0, 0, 0);

    const orderData = {
        userId: session.userId,
        customerName: session.name,
        createdAt: new Date().toISOString(),
        type: 'grocery_list' as const,
        rawList: notes,
        deliveryAddress: address,
        deliveryDate: deliveryDate.toISOString(),
        total: 0, // Total wird vom Mitarbeiter festgelegt
        status: 'new' as const,
    };
    
    await adminDb.collection('orders').add(orderData);

    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard');
    revalidatePath('/employee/scanner');
    revalidatePath('/dashboard/orders');
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await getSession();
  if (!session || !['admin', 'employee'].includes(session.role)) {
    throw new Error('Unauthorized');
  }

  await adminDb.collection('orders').doc(orderId).update({ status });

  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');
  revalidatePath('/employee/scanner');
  revalidatePath('/dashboard/orders');
}

export async function setGroceryOrderTotal(orderId: string, total: number, checklist: ChecklistItem[]) {
    const session = await getSession();
    if (!session || !['admin', 'employee'].includes(session.role)) {
        throw new Error('Unauthorized');
    }

    await adminDb.collection('orders').doc(orderId).update({
        total,
        checklist: toPlainObject(checklist),
        status: 'ready_for_delivery',
        processedBy: session.userId,
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard');
    revalidatePath('/employee/scanner');
    revalidatePath('/dashboard/orders');
}


export async function getOrdersPageData() {
    const session = await getSession();
    if (session?.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    try {
        const ordersSnapshot = await adminDb.collection('orders').get();
        const usersSnapshot = await adminDb.collection('users').get();
        
        const orders = ordersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Order));
        const users = usersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as User));
        
        return { orders, users };
    } catch (error) {
        console.error("Error fetching data for orders page:", error);
        throw new Error("Failed to load data from Firestore.");
    }
}


export async function getCustomerOrders() {
    const session = await getSession();
    if (!session?.userId) {
        throw new Error("Not authenticated");
    }

    try {
        const ordersSnapshot = await adminDb.collection('orders')
            .where('userId', '==', session.userId)
            .orderBy('createdAt', 'desc')
            .get();

        if (ordersSnapshot.empty) {
            return [];
        }

        const orders = ordersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Order));
        return orders;
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        throw new Error("Could not fetch customer orders.");
    }
}
