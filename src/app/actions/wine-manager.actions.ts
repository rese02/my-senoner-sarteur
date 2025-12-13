'use server';

import 'server-only';
import { getSession } from '@/lib/session';
import { enrichWineList } from '@/ai/flows/enrich-wine-list';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase-admin';
import type { Product } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';
import { z } from 'zod';

// Strikte Berechtigungsprüfung: Nur Admins dürfen diese Aktionen ausführen.
async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required.');
  }
}

const WineSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    tags: z.array(z.string()),
    // Hinzufügen der optionalen Felder, die in Product vorhanden sind
    price: z.number().optional(),
    unit: z.string().optional(),
    imageUrl: z.string().optional(),
    imageHint: z.string().optional(),
    categoryId: z.string().optional(),
    description: z.string().optional(),
    isAvailable: z.boolean().optional(),
    type: z.enum(['product', 'package']).optional(),
    packageContent: z.array(z.object({ item: z.string(), amount: z.string() })).optional(),
    createdAt: z.string().optional(),
});


export async function deleteAllWines() {
    await requireAdmin();
    const batch = adminDb.batch();
    const snapshot = await adminDb.collection('wine_catalog').get();
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    revalidatePath('/admin/sommelier');
    return { success: true };
}

export async function deleteWine(wineId: string) {
    await requireAdmin();
    const validatedId = z.string().min(1).parse(wineId);
    await adminDb.collection('wine_catalog').doc(validatedId).delete();
    revalidatePath('/admin/sommelier');
    return { success: true };
}

export async function updateWine(wine: Product): Promise<Product> {
    await requireAdmin();
    const validation = WineSchema.safeParse(wine);
    if (!validation.success) {
        throw new Error("Invalid wine data: " + JSON.stringify(validation.error.flatten().fieldErrors));
    }
    const { id, ...data } = validation.data;

    const wineRef = adminDb.collection('wine_catalog').doc(id);
    // Nur die Felder aktualisieren, die im Schema definiert sind.
    const dataToUpdate = { name: data.name, tags: data.tags };
    await wineRef.update(toPlainObject(dataToUpdate));

    revalidatePath('/admin/sommelier');
    return wine;
}

export async function bulkImportWines(wineNames: string[]): Promise<Product[]> {
    await requireAdmin();

    const validatedNames = z.array(z.string().min(1)).min(1).safeParse(wineNames);
    if (!validatedNames.success) {
        throw new Error("Wine list cannot be empty or contain invalid names.");
    }

    const { enrichedWines } = await enrichWineList({ wineNames: validatedNames.data });

    if (!enrichedWines || enrichedWines.length === 0) {
        throw new Error("AI failed to enrich the wine list.");
    }

    const batch = adminDb.batch();
    const newWineDocs: Product[] = [];

    enrichedWines.forEach(wine => {
        const docRef = adminDb.collection('wine_catalog').doc();
        const newWineData: Partial<Product> = {
            name: wine.name,
            tags: wine.tags,
            createdAt: new Date().toISOString(),
            // Setzen von Standardwerten, damit sie mit dem Product-Typ übereinstimmen
            price: 0,
            unit: 'Flasche',
            isAvailable: true,
            type: 'product',
            imageUrl: '',
            imageHint: 'wine bottle',
            categoryId: 'ai-sommelier-weine' // Eine Standard-Kategorie
        };
        batch.set(docRef, newWineData);
        newWineDocs.push(toPlainObject({ ...newWineData, id: docRef.id } as Product));
    });
    
    await batch.commit();

    revalidatePath('/admin/sommelier');
    return newWineDocs;
}

// Diese Funktion ist öffentlich für den Sommelier-Flow zugänglich.
export async function getWineCatalog(): Promise<Product[]> {
    try {
        const snapshot = await adminDb.collection('wine_catalog').get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Product));
    } catch(e) {
        console.error("Failed to get wine catalog.", e);
        return [];
    }
}
