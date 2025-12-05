'use server';

import 'server-only';
import { getSession } from '@/lib/session';
import { enrichWineList } from '@/ai/flows/enrich-wine-list';
import { revalidatePath } from 'next/cache';
import { adminDb } from '@/lib/firebase-admin';
import type { Product } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';

// Helper to check for Admin role
async function isAdmin() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required.');
  }
  return true;
}


export async function deleteAllWines() {
    await isAdmin();
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
    await isAdmin();
    await adminDb.collection('wine_catalog').doc(wineId).delete();
    revalidatePath('/admin/sommelier');
    return { success: true };
}

export async function updateWine(wine: Product): Promise<Product> {
    await isAdmin();
    const { id, ...data } = wine;

    if (!id) {
        throw new Error("Wine ID is missing");
    }

    const wineRef = adminDb.collection('wine_catalog').doc(id);
    await wineRef.update(toPlainObject(data));

    revalidatePath('/admin/sommelier');
    return wine;
}

export async function bulkImportWines(wineNames: string[]): Promise<Product[]> {
    await isAdmin();

    if (wineNames.length === 0) {
        throw new Error("Wine list cannot be empty.");
    }

    const { enrichedWines } = await enrichWineList({ wineNames });

    if (!enrichedWines || enrichedWines.length === 0) {
        throw new Error("AI failed to enrich the wine list.");
    }

    const batch = adminDb.batch();
    const newWineDocs: Product[] = [];

    enrichedWines.forEach(wine => {
        const docRef = adminDb.collection('wine_catalog').doc();
        const newWineData: Omit<Product, 'id' | 'price' | 'unit' | 'imageUrl' | 'imageHint' | 'categoryId' | 'isAvailable' | 'type' > = {
            name: wine.name,
            tags: wine.tags,
            createdAt: new Date().toISOString(),
        };
        batch.set(docRef, newWineData);
        newWineDocs.push(toPlainObject({ ...newWineData, id: docRef.id } as unknown as Product));
    });
    
    await batch.commit();

    revalidatePath('/admin/sommelier');
    return newWineDocs;
}

export async function getWineCatalog(): Promise<Product[]> {
    const snapshot = await adminDb.collection('wine_catalog').get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => toPlainObject({ id: doc.id, ...doc.data() } as Product));
}
