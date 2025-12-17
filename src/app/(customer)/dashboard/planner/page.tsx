
'use server';
import { adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import { getPlannerPageData } from '@/app/actions/marketing.actions';
import { PlannerClient } from './client';

export default async function PartyPlannerPage() {
    const plannerEventsSnap = await adminDb.collection('plannerEvents').limit(1).get();
    if (plannerEventsSnap.empty) {
        redirect('/dashboard');
    }
    
    const { plannerEvents, products } = await getPlannerPageData();

    return (
        <PlannerClient 
            initialEvents={plannerEvents} 
            initialProducts={products}
        />
    );
}
