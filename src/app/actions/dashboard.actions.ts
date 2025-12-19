
'use server';

import 'server-only';
import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { toPlainObject } from '@/lib/utils';
import type { Order, User } from '@/lib/types';
import { subDays, startOfDay, format, parseISO } from 'date-fns';

async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required.');
  }
}

// Get STATS for the admin dashboard using aggregation queries
export async function getDashboardStats() {
    await requireAdmin();
    try {
        const ordersCol = adminDb.collection('orders');
        const usersCol = adminDb.collection('users');

        // Fetch completed orders to calculate revenue manually
        const revenueQuery = ordersCol.where('status', 'in', ['collected', 'delivered', 'paid']);
        const revenueSnap = await revenueQuery.get();
        const totalRevenue = revenueSnap.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);
        
        const [totalOrdersSnap, totalCustomersSnap, openOrdersSnap] = await Promise.all([
            ordersCol.count().get(),
            usersCol.where('role', '==', 'customer').count().get(),
            ordersCol.where('status', 'in', ['new', 'picking', 'ready', 'ready_for_delivery']).count().get()
        ]);
        
        return toPlainObject({
            totalRevenue: totalRevenue,
            totalOrders: totalOrdersSnap.data().count,
            totalCustomers: totalCustomersSnap.data().count,
            openOrders: openOrdersSnap.data().count
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, openOrders: 0 };
    }
}

// Get recent orders for the admin dashboard (limited)
export async function getRecentOrders() {
    await requireAdmin();
    try {
        const recentOrdersSnap = await adminDb.collection('orders')
            .where('status', 'in', ['new', 'picking', 'ready', 'ready_for_delivery'])
            .limit(50) // Fetch a bit more to sort in code
            .get();

        const orders = recentOrdersSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Order));
            
        // Sort in code instead of in the query to avoid needing a composite index
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
        return orders.slice(0, 10); // Return only the top 10 most recent
    } catch (error) {
        console.error("Error fetching recent orders:", error);
        return [];
    }
}

// Get data for the chart on the admin dashboard
export async function getOrdersForChart() {
    await requireAdmin();
    try {
        const last7Days = Array.from({ length: 7 }).map((_, i) => {
            const d = subDays(new Date(), i);
            return format(startOfDay(d), 'yyyy-MM-dd');
        }).reverse();

        const ordersByDay: Record<string, number> = last7Days.reduce((acc, dateStr) => {
            acc[dateStr] = 0;
            return acc;
        }, {} as Record<string, number>);

        const ordersSnap = await adminDb.collection('orders')
            .where('createdAt', '>=', startOfDay(subDays(new Date(), 6)).toISOString())
            .get();
        
        ordersSnap.forEach(doc => {
            const order = doc.data() as Order;
            if (!order.createdAt) return;
            const orderDate = format(parseISO(order.createdAt), 'yyyy-MM-dd');
            if (ordersByDay.hasOwnProperty(orderDate)) {
                ordersByDay[orderDate]++;
            }
        });

        return toPlainObject(last7Days.map(dateStr => ({
            date: format(parseISO(dateStr), 'EEE'),
            totalOrders: ordersByDay[dateStr]
        })));
    } catch (error) {
        console.error("Error fetching chart data:", error);
        return [];
    }
}
