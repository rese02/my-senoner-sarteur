'use server';

import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { toPlainObject } from '@/lib/utils';
import type { Story, PlannerEvent } from '@/lib/types';
import { revalidatePath } from 'next/cache';

async function isAdmin() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required.');
  }
  return true;
}

// --- Story Actions ---

export async function saveStory(storyData: Partial<Story>): Promise<Story> {
    await isAdmin();
    const { id, ...data } = storyData;

    if (!data.label || !data.author || !data.imageUrl) {
        throw new Error("Missing required story fields.");
    }

    if (id && id.startsWith('story-')) { // New story
        const newDocRef = await adminDb.collection('stories').add(toPlainObject(data));
        revalidatePaths();
        return { ...data, id: newDocRef.id } as Story;
    } else { // Existing story
        await adminDb.collection('stories').doc(id!).update(toPlainObject(data));
        revalidatePaths();
        return { ...data, id: id! } as Story;
    }
}

export async function deleteStory(storyId: string) {
    await isAdmin();
    await adminDb.collection('stories').doc(storyId).delete();
    revalidatePaths();
}


// --- Planner Event Actions ---

export async function savePlannerEvent(eventData: Partial<PlannerEvent>): Promise<PlannerEvent> {
    await isAdmin();
    const { id, ...data } = eventData;

    if (!data.title || !data.ingredients) {
        throw new Error("Missing required event fields.");
    }

    if (id && id.startsWith('plan-')) { // New event
        const newDocRef = await adminDb.collection('plannerEvents').add(toPlainObject(data));
        revalidatePaths();
        return { ...data, id: newDocRef.id } as PlannerEvent;
    } else { // Existing event
        await adminDb.collection('plannerEvents').doc(id!).update(toPlainObject(data));
        revalidatePaths();
        return { ...data, id: id! } as PlannerEvent;
    }
}

export async function deletePlannerEvent(eventId: string) {
    await isAdmin();
    await adminDb.collection('plannerEvents').doc(eventId).delete();
    revalidatePaths();
}


// --- Data Fetching Actions ---
export async function getMarketingPageData() {
    await isAdmin();
    const storiesSnap = await adminDb.collection('stories').get();
    const plannerEventsSnap = await adminDb.collection('plannerEvents').get();
    const productsSnap = await adminDb.collection('products').where('isAvailable', '==', true).get();

    const stories = storiesSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Story));
    const plannerEvents = plannerEventsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as PlannerEvent));
    const products = productsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as any));
    
    return { stories, plannerEvents, products };
}

export async function getPlannerPageData() {
    const plannerEventsSnap = await adminDb.collection('plannerEvents').get();
    const productsSnap = await adminDb.collection('products').where('isAvailable', '==', true).get();
    
    const plannerEvents = plannerEventsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as PlannerEvent));
    const products = productsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as any));

    return { plannerEvents, products };
}

// Helper to revalidate all relevant paths
function revalidatePaths() {
    revalidatePath('/admin/marketing');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/planner');
}
