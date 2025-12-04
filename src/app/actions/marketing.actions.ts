'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import type { Story, PlannerEvent, Product, Recipe } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';
import { mockAppConfig } from '@/lib/mock-data';


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
    
    // Add expiresAt for new stories
    const storyToSave = {
      ...data,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    if (id && id.startsWith('story-')) { // New story
        const newDocRef = await adminDb.collection('stories').add(toPlainObject(storyToSave));
        revalidatePaths();
        return { ...storyToSave, id: newDocRef.id } as Story;
    } else { // Existing story
        // When updating, we might not want to change expiry, but for now we do
        await adminDb.collection('stories').doc(id!).update(toPlainObject(storyToSave));
        revalidatePaths();
        return { ...storyToSave, id: id! } as Story;
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

// --- Recipe of the Week Action ---
export async function saveRecipeOfTheWeek(recipeData: Recipe) {
    await isAdmin();
    // This is a mock implementation. In a real app, this would save to Firestore.
    // For now, we update the in-memory mock data.
    mockAppConfig.recipeOfTheWeek = toPlainObject(recipeData);
    revalidatePaths(); // Revalidate paths to show changes
    return { success: true };
}


// --- Data Fetching Actions ---
export async function getMarketingPageData() {
    await isAdmin();
    const storiesSnap = await adminDb.collection('stories').get();
    const plannerEventsSnap = await adminDb.collection('plannerEvents').get();
    const productsSnap = await adminDb.collection('products').where('isAvailable', '==', true).get();

    const stories = storiesSnap.docs
      .map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Story))
      .filter(story => new Date(story.expiresAt || 0) > new Date()); // Filter out expired stories
      
    const plannerEvents = plannerEventsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as PlannerEvent));
    const products = productsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Product));
    
    // For the recipe, we still use mock data as per instructions
    const recipe = mockAppConfig.recipeOfTheWeek;

    return { stories, plannerEvents, products, recipe };
}

export async function getPlannerPageData() {
    const plannerEventsSnap = await adminDb.collection('plannerEvents').get();
    const productsSnap = await adminDb.collection('products').where('isAvailable', '==', true).get();
    
    const plannerEvents = plannerEventsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as PlannerEvent));
    const products = productsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Product));

    return { plannerEvents, products };
}

// Helper to revalidate all relevant paths
function revalidatePaths() {
    revalidatePath('/admin/marketing');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/planner');
}
