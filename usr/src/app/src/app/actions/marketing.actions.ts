
'use server';
import 'server-only';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import type { Story, PlannerEvent, Product, Recipe, WheelOfFortuneSettings, User } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';
import { z } from 'zod';

// Helper for strict role checks
async function requireRole(roles: Array<'customer' | 'admin'>) {
    const session = await getSession();
    if (!session || !roles.includes(session.role)) {
        throw new Error('Unauthorized');
    }
    return session;
}

async function requireAdmin() {
    return requireRole(['admin']);
}

// Zod Schemas for validation
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

const WheelOfFortuneSettingsSchema = z.object({
    isActive: z.boolean(),
    schedule: z.enum(['daily', 'weekly', 'monthly']),
    segments: z.array(z.object({
        text: z.string().min(1, "Segment text cannot be empty"),
        type: z.enum(['win', 'lose']),
    })).min(2, "At least two segments are required."),
    developerMode: z.boolean().optional(),
});


// --- Story Actions ---
export async function saveStory(storyData: Partial<Story>): Promise<Story> {
    await requireAdmin();
    
    const validation = StorySchema.safeParse(storyData);
    if (!validation.success) {
        throw new Error("Invalid story data: " + JSON.stringify(validation.error.flatten().fieldErrors));
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
        throw new Error("Invalid event data: " + JSON.stringify(validation.error.flatten().fieldErrors));
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
        throw new Error("Invalid recipe data: " + JSON.stringify(validation.error.flatten().fieldErrors));
    }
    await adminDb.collection('content').doc('recipe_of_the_week').set(toPlainObject(validation.data));
    revalidatePaths();
    return { success: true };
}

// --- Wheel of Fortune Actions ---
export async function saveWheelSettings(settings: WheelOfFortuneSettings) {
    await requireAdmin();
    const validation = WheelOfFortuneSettingsSchema.safeParse(settings);
    if (!validation.success) {
        throw new Error("Invalid wheel settings: " + JSON.stringify(validation.error.flatten().fieldErrors));
    }
    await adminDb.collection('content').doc('wheel_of_fortune').set(toPlainObject(validation.data));
    revalidatePath('/admin/marketing');
    revalidatePath('/dashboard');
    return { success: true };
}

export async function spinWheel(): Promise<{ winningSegment: number; prize: string; }> {
    const session = await requireRole(['customer']);
    const userRef = adminDb.collection('users').doc(session.userId);
    const userSnap = await userRef.get();
    const user = userSnap.data() as User;

    if (user.activePrize) {
        throw new Error("Sie haben bereits einen aktiven Gewinn. Lösen Sie ihn zuerst ein!");
    }

    const wheelSettings = await getWheelSettings();
    const canPlay = await canUserPlay(session.userId, wheelSettings);

    if (!wheelSettings.isActive || !canPlay) {
        throw new Error("Not eligible to play right now.");
    }

    const winningSegmentIndex = Math.floor(Math.random() * wheelSettings.segments.length);
    const winningSegment = wheelSettings.segments[winningSegmentIndex];
    const prize = winningSegment.text;

    const updates: { lastWheelSpin: string, activePrize?: string } = {
        lastWheelSpin: new Date().toISOString(),
    };
    
    if (winningSegment.type === 'win') {
        updates.activePrize = prize;
    }

    await userRef.update(updates);

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/loyalty');

    return {
        winningSegment: winningSegmentIndex,
        prize: prize,
    };
}

// --- Data Fetching Actions ---
export async function getMarketingPageData() {
    await requireAdmin();
    try {
        const storiesSnap = await adminDb.collection('stories').get();
        const plannerEventsSnap = await adminDb.collection('plannerEvents').get();
        const productsSnap = await adminDb.collection('products').where('isAvailable', '==', true).get();
        const recipeDoc = await adminDb.collection('content').doc('recipe_of_the_week').get();
        const wheelDoc = await adminDb.collection('content').doc('wheel_of_fortune').get();


        const stories = storiesSnap.docs
        .map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Story))
        .filter(story => new Date(story.expiresAt || 0) > new Date());
        
        const plannerEvents = plannerEventsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as PlannerEvent));
        const products = productsSnap.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Product));
        const recipe = recipeDoc.exists ? toPlainObject(recipeDoc.data() as Recipe) : getFallbackRecipe();
        const wheelSettings = wheelDoc.exists ? toPlainObject(wheelDoc.data() as WheelOfFortuneSettings) : getFallbackWheelSettings();
        
        return { stories, plannerEvents, products, recipe, wheelSettings };
    } catch(e) {
        console.error("Failed to get marketing page data", e);
        return { stories: [], plannerEvents: [], products: [], recipe: getFallbackRecipe(), wheelSettings: getFallbackWheelSettings() };
    }
}

async function getWheelSettings(): Promise<WheelOfFortuneSettings> {
    const wheelDoc = await adminDb.collection('content').doc('wheel_of_fortune').get();
    return wheelDoc.exists 
        ? toPlainObject(wheelDoc.data() as WheelOfFortuneSettings) 
        : getFallbackWheelSettings();
}

export async function getWheelOfFortuneDataForCustomer() {
    const session = await getSession();
    if (!session?.userId) return null;

    const userDoc = await adminDb.collection('users').doc(session.userId).get();
    const user = userDoc.data() as User;

    if (user.activePrize) return null; // If they have a prize, don't show the wheel

    const settings = await getWheelSettings();
    if (!settings.isActive) return null;

    const canPlay = await canUserPlay(session.userId, settings);

    if (canPlay) {
        return settings;
    }
    
    return null;
}

async function canUserPlay(userId: string, settings: WheelOfFortuneSettings): Promise<boolean> {
    // If developer mode is on, user can always play.
    if (settings.developerMode) {
        return true;
    }

    const userDoc = await adminDb.collection('users').doc(userId).get();
    const user = userDoc.data() as User;

    if (!user.lastWheelSpin) return true; // Never played before

    const lastSpin = new Date(user.lastWheelSpin);
    const now = new Date();
    
    const diffTime = Math.abs(now.getTime() - lastSpin.getTime());
    const diffHours = diffTime / (1000 * 60 * 60);

    switch (settings.schedule) {
        case 'daily':
            return diffHours >= 24;
        case 'weekly':
            return diffHours >= 24 * 7;
        case 'monthly':
            return diffHours >= 24 * 30; // Simplified
        default:
            return false;
    }
}


export async function getPlannerPageData() {
    // This function can be called by customers.
    await requireRole(['customer']);
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

function getFallbackWheelSettings(): WheelOfFortuneSettings {
    return {
        isActive: false,
        schedule: 'daily',
        segments: [
            { text: '5% Rabatt', type: 'win' },
            { text: 'Niete', type: 'lose' },
            { text: 'Gratis Espresso', type: 'win' },
            { text: 'Niete', type: 'lose' },
            { text: '10% Rabatt', type: 'win' },
            { text: 'Niete', type: 'lose' },
        ],
        developerMode: false,
    };
}
