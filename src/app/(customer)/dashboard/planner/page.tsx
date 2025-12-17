
'use server';
import { getPlannerPageData } from '@/app/actions/marketing.actions';
import { PlannerClient } from './client';
import { redirect } from 'next/navigation';

export default async function PartyPlannerPage() {
    // Server-side check if feature is available
    const { plannerEvents, products } = await getPlannerPageData();
    if (!plannerEvents || plannerEvents.length === 0) {
        redirect('/dashboard');
    }
    
    return (
        <PlannerClient 
            initialEvents={plannerEvents} 
            initialProducts={products}
        />
    );
}
