
'use server';

import { getSession } from '@/lib/session';
import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { CartItem, Order, User, ChecklistItem, OrderItem, OrderStatus } from '@/lib/types';
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

  // Map CartItem[] to OrderItem[] and ensure productName is included
  const orderItems: OrderItem[] = validatedItems.data.map(item => ({
    productId: item.productId,
    productName: item.name, // Ensure the name is explicitly mapped
    quantity: item.quantity,
    price: item.price,
  }));

  const orderData: Omit<Order, 'id'> = {
    userId: session.id,
    customerName: session.name,
    createdAt: new Date().toISOString(),
    type: 'preorder',
    items: toPlainObject(orderItems), // Use the new orderItems array
    pickupDate: validatedDate.data.toISOString(),
    total,
    status: 'new',
  };

  await adminDb.collection('orders').add(orderData);

  revalidatePath('/admin', 'layout'); // Revalidate the whole admin layout
  revalidatePath('/dashboard', 'layout'); // Revalidate the whole customer layout
}


export async function createConciergeOrder(
  notes: string,
  address: { street: string; city: string },
  deliveryDate: Date
) {
    const session = await requireRole(['customer']);

    const validatedNotes = z.string().trim().min(1).safeParse(notes);
    const validatedAddress = AddressSchema.safeParse(address);
    const validatedDate = z.date().min(new Date()).safeParse(deliveryDate);

    if (!validatedNotes.success) throw new Error('Notes are empty.');
    if (!validatedAddress.success) throw new Error('Invalid address.');
    if (!validatedDate.success) throw new Error('Invalid delivery date.');

    const finalDeliveryDate = validatedDate.data;
    finalDeliveryDate.setHours(11, 0, 0, 0);

    const orderData: Omit<Order, 'id'> = {
        userId: session.id,
        customerName: session.name,
        createdAt: new Date().toISOString(),
        type: 'grocery_list',
        rawList: validatedNotes.data,
        deliveryAddress: validatedAddress.data,
        deliveryDate: finalDeliveryDate.toISOString(),
        total: 0, // Set initial total to 0, it will be calculated later.
        status: 'new',
    };
    
    await adminDb.collection('orders').add(orderData);

    revalidatePath('/admin', 'layout');
    revalidatePath('/dashboard', 'layout');
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireRole(['admin', 'employee']);

  const validatedOrderId = z.string().min(1).parse(orderId);
  
  // Use z.enum with all possible OrderStatus values
  const allStatuses: [OrderStatus, ...OrderStatus[]] = ['new', 'picking', 'ready', 'collected', 'ready_for_delivery', 'delivered', 'paid', 'cancelled'];
  const validatedStatus = z.enum(allStatuses).parse(status);

  await adminDb.collection('orders').doc(validatedOrderId).update({ status: validatedStatus });

  revalidatePath('/admin', 'layout');
  revalidatePath('/employee', 'layout');
  revalidatePath('/dashboard', 'layout');
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

    // Add delivery fee to final total
    const finalTotal = validatedTotal + 5;

    await adminDb.collection('orders').doc(validatedOrderId).update({
        total: finalTotal,
        checklist: toPlainObject(validatedChecklist),
        status: 'ready_for_delivery',
        processedBy: session.id,
    });
    
    revalidatePath('/admin', 'layout');
    revalidatePath('/employee', 'layout');
    revalidatePath('/dashboard', 'layout');
}


export async function getOrdersPageData() {
    await requireRole(['admin']);

    try {
        const ordersSnapshot = await adminDb.collection('orders').orderBy('createdAt', 'desc').get();
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
            .where('userId', '==', session.id)
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


export async function deleteMyOrders(orderIds: string[]): Promise<{ success: boolean, count: number, error?: string }> {
    const session = await requireRole(['customer']);
    const validatedIds = z.array(z.string().min(1)).safeParse(orderIds);

    if (!validatedIds.success || validatedIds.data.length === 0) {
        return { success: false, count: 0, error: 'Keine gültigen Bestellungen zum Löschen ausgewählt.' };
    }

    const deletableStatuses: OrderStatus[] = ['collected', 'delivered', 'paid', 'cancelled'];
    const batch = adminDb.batch();
    let deletedCount = 0;

    for (const id of validatedIds.data) {
        const orderRef = adminDb.collection('orders').doc(id);
        const doc = await orderRef.get();

        if (doc.exists) {
            const order = doc.data() as Order;
            // SECURITY CHECKS: Must be own order and must be in a deletable state
            if (order.userId === session.id && deletableStatuses.includes(order.status)) {
                batch.delete(orderRef);
                deletedCount++;
            }
        }
    }

    if (deletedCount > 0) {
        await batch.commit();
        revalidatePath('/dashboard/orders', 'page');
    }

    return { success: true, count: deletedCount };
}
