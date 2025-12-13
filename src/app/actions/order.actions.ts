'use server';

import { getSession } from '@/lib/session';
import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { CartItem, Order, User, ChecklistItem } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';
import { z } from 'zod';

// Helper für Berechtigungsprüfungen
async function requireRole(roles: Array<'customer' | 'employee' | 'admin'>) {
    const session = await getSession();
    if (!session || !roles.includes(session.role)) {
        throw new Error('Unauthorized');
    }
    return session;
}

const CartItemSchema = z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().positive(),
});

const AddressSchema = z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
});

export async function createPreOrder(
  items: CartItem[],
  pickupDate: Date
) {
  const session = await requireRole(['customer']);

  const validatedItems = z.array(CartItemSchema).min(1).safeParse(items);
  const validatedDate = z.date().min(new Date()).safeParse(pickupDate);

  if (!validatedItems.success) throw new Error('Cart is empty or invalid.');
  if (!validatedDate.success) throw new Error('Invalid pickup date.');

  const total = validatedItems.data.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderData = {
    userId: session.userId,
    customerName: session.name,
    createdAt: new Date().toISOString(),
    type: 'preorder' as const,
    items: validatedItems.data.map(item => toPlainObject(item)),
    pickupDate: validatedDate.data.toISOString(),
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
    const session = await requireRole(['customer']);

    const validatedNotes = z.string().trim().min(1).safeParse(notes);
    const validatedAddress = AddressSchema.safeParse(address);

    if (!validatedNotes.success) throw new Error('Notes are empty.');
    if (!validatedAddress.success) throw new Error('Invalid address.');

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    deliveryDate.setHours(11, 0, 0, 0);

    const orderData = {
        userId: session.userId,
        customerName: session.name,
        createdAt: new Date().toISOString(),
        type: 'grocery_list' as const,
        rawList: validatedNotes.data,
        deliveryAddress: validatedAddress.data,
        deliveryDate: deliveryDate.toISOString(),
        total: 0,
        status: 'new' as const,
    };
    
    await adminDb.collection('orders').add(orderData);

    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard');
    revalidatePath('/employee/scanner');
    revalidatePath('/dashboard/orders');
}

export async function updateOrderStatus(orderId: string, status: 'new' | 'picking' | 'ready' | 'collected' | 'ready_for_delivery' | 'delivered' | 'paid' | 'cancelled') {
  await requireRole(['admin', 'employee']);

  const validatedOrderId = z.string().min(1).parse(orderId);
  const validatedStatus = z.enum(['new', 'picking', 'ready', 'collected', 'ready_for_delivery', 'delivered', 'paid', 'cancelled']).parse(status);

  await adminDb.collection('orders').doc(validatedOrderId).update({ status: validatedStatus });

  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');
  revalidatePath('/employee/scanner');
  revalidatePath('/dashboard/orders');
}

const ChecklistItemSchema = z.object({
    item: z.string(),
    isFound: z.boolean(),
});

export async function setGroceryOrderTotal(orderId: string, total: number, checklist: ChecklistItem[]) {
    const session = await requireRole(['admin', 'employee']);

    const validatedOrderId = z.string().min(1).parse(orderId);
    const validatedTotal = z.number().positive().parse(total);
    const validatedChecklist = z.array(ChecklistItemSchema).parse(checklist);

    await adminDb.collection('orders').doc(validatedOrderId).update({
        total: validatedTotal,
        checklist: toPlainObject(validatedChecklist),
        status: 'ready_for_delivery',
        processedBy: session.userId,
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard');
    revalidatePath('/employee/scanner');
    revalidatePath('/dashboard/orders');
}


export async function getOrdersPageData() {
    await requireRole(['admin']);

    try {
        const ordersSnapshot = await adminDb.collection('orders').get();
        const usersSnapshot = await adminDb.collection('users').get();
        
        const orders = ordersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Order));
        const users = usersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as User));
        
        return { orders, users };
    } catch (error) {
        console.error("Error fetching data for orders page:", error);
        return { orders: [], users: [] };
    }
}


export async function getCustomerOrders() {
    const session = await requireRole(['customer']);

    try {
        const ordersSnapshot = await adminDb.collection('orders')
            .where('userId', '==', session.userId)
            .get();

        if (ordersSnapshot.empty) {
            return [];
        }

        const orders = ordersSnapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Order));

        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        return orders;
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        throw new Error("Could not fetch customer orders.");
    }
}
