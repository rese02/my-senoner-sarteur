
'use server';

import { getCustomerDetails } from '@/app/actions/customer.actions';
import type { Order, User } from '@/lib/types';
import { CustomerDetailClient } from './client';

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
    const customerId = params.id;
    const { customer, orders } = await getCustomerDetails(customerId);

    return (
        <CustomerDetailClient 
            customer={customer}
            orders={orders}
            customerId={customerId}
        />
    );
}
