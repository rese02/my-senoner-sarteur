'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import type { Story, PlannerEvent, Product, Recipe } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';
import { z } from 'zod';

// Strikte Berechtigungsprüfung: Nur Admins dürfen diese Aktionen ausführen.
async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required.');
  }
}

// Zod Schemata für die Validierung
const StorySchema = z.object({
    id: z.string().optional(),
    label: z.string().min(1, "Label is required."),
    author: z.string().min(1, "Author is required."),
    imageUrl: z.string().url("A valid image URL is required.").or(z.literal('')),
    imageHint: z.string().optional(),
});

const PlannerEventSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required."),
    description: z.string().optional(),
    imageUrl: z.string().url("A valid image URL is required.").or(z.literal('')),
    imageHint: z.string().optional(),
    ingredients: z.array(z.object({
        productId: z.string(),
        productName: z.string(),
        baseAmount: z.number(),
        unit: z.string(),
    })).min(1, "At least one ingredient rule is required."),
});

const RecipeSchema = z.object({
    title: z.string().min(1),
    subtitle: z.string(),
    image: z.string().url().or(z.literal('')),
    imageHint: z.string().optional(),
    ingredients: z.array(z.string()),
    instructions: z.string(),
    description: z.string(),
});


// --- Story Actions ---
export async function saveStory(storyData: Partial<Story>): Promise<Story> {
    await requireAdmin();
    
    const validation = StorySchema.safeParse(storyData);
    if (!validation.success) {
        throw new Error("Invalid story data: " + validation.error.flatten().fieldErrors);
    }
    const { id, ...data } = validation.data;
    
    const storyToSave = {
      ...data,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    if (id && storyData.id) { // Eindeutige Prüfung, um sicherzugehen
        await adminDb.collection('stories').doc(id).update(toPlainObject(storyToSave));
        revalidatePaths();
        return { ...storyToSave, id: id } as Story;
    } else {
        const newDocRef = await adminDb.collection('stories').add(toPlainObject(storyToSave));
        revalidatePaths();
        return { ...storyToSave, id: newDocRef.id } as Story;
    }
}

export async function deleteStory(storyId: string) {
    await requireAdmin();
    const validatedId = z.string().min(1).parse(storyId);
    await adminDb.collection('stories').doc(validatedId).delete();
    revalidatePaths();
}


// --- Planner Event Actions ---
export async function savePlannerEvent(eventData: Partial<PlannerEvent>): Promise<PlannerEvent> {
    await requireAdmin();
    const validation = PlannerEventSchema.safeParse(eventData);
    if (!validation.success) {
        throw new Error("Invalid event data: " + validation.error.flatten().fieldErrors);
    }
    const { id, ...data } = validation.data;

    if (id && eventData.id) {
        await adminDb.collection('plannerEvents').doc(id).update(toPlainObject(data));
        revalidatePaths();
        return { ...data, id: id } as PlannerEvent;
    } else {
        const newDocRef = await adminDb.collection('plannerEvents').add(toPlainObject(data));
        revalidatePaths();
        return { ...data, id: newDocRef.id } as PlannerEvent;
    }
}

export async function deletePlannerEvent(eventId: string) {
    await requireAdmin();
    const validatedId = z.string().min(1).parse(eventId);
    await adminDb.collection('plannerEvents').doc(validatedId).delete();
    revalidatePaths();
}

// --- Recipe of the Week Action ---
export async function saveRecipeOfTheWeek(recipeData: Recipe) {
    await requireAdmin();
    const validation = RecipeSchema.safeParse(recipeData);
     if (!validation.success) {
        throw new Error("Invalid recipe data: " + validation.error.flatten().fieldErrors);
    }
    await adminDb.collection('content').doc('recipe_of_the_week').set(toPlainObject(validation.data));
    revalidatePaths();
    return { success: true };
}


// --- Data Fetching Actions ---
export async function getMarketingPageData() {
    await requireAdmin();
    try {
        const storiesSnap = await adminDb.collection('stories').get();
        const plannerEventsSnap = await adminDb.collection('plannerEvents').get();
        const productsSnap = await adminDb.collection('products').where('isAvailable', '==', true).get();
        const recipeDoc = await adminDb.collection('content').doc('recipe_of_the_week').get();

        const stories = storiesSnap.docs
        .map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Story))
        .filter(story => new Date(story.expiresAt || 0) > new Date());
        
        const plannerEvents = plannerEventsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as PlannerEvent));
        const products = productsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Product));
        const recipe = recipeDoc.exists ? toPlainObject(recipeDoc.data() as Recipe) : getFallbackRecipe();
        
        return { stories, plannerEvents, products, recipe };
    } catch(e) {
        console.error("Failed to get marketing page data", e);
        return { stories: [], plannerEvents: [], products: [], recipe: getFallbackRecipe() };
    }
}

export async function getPlannerPageData() {
    // Diese Funktion ist öffentlich zugänglich
    try {
        const plannerEventsSnap = await adminDb.collection('plannerEvents').get();
        const productsSnap = await adminDb.collection('products').where('isAvailable', '==', true).get();
        
        const plannerEvents = plannerEventsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as PlannerEvent));
        const products = productsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Product));

        return { plannerEvents, products };
    } catch(e) {
        console.error("Failed to get planner page data", e);
        return { plannerEvents: [], products: [] };
    }
}

// Helper to revalidate all relevant paths
function revalidatePaths() {
    revalidatePath('/admin/marketing');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/planner');
}


function getFallbackRecipe(): Recipe {
    return {
        title: 'Kein Rezept verfügbar',
        subtitle: 'Bitte im Admin-Bereich ein Rezept der Woche festlegen.',
        image: 'https://picsum.photos/seed/recipefallback/1080/800',
        imageHint: 'empty plate',
        description: 'Derzeit ist kein Rezept der Woche hinterlegt.',
        ingredients: [],
        instructions: ''
    };
}
