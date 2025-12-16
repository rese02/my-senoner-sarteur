'use server';

import { adminDb } from '@/lib/firebase-admin';
import { toPlainObject } from '@/lib/utils';
import type { Order } from '@/lib/types';
import { EmployeeScannerClient } from './client'; 

export default async function EmployeePage() {
    // Laden der offenen Einkaufszettel
    const ordersSnap = await adminDb.collection('orders')
        .where('type', '==', 'grocery_list')
        .where('status', '==', 'new')
        .get();
        
    const openOrders = ordersSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Order));

    return <EmployeeScannerClient initialOrders={openOrders} />;
}
