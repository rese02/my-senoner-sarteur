'use server';

import { getSession } from '@/lib/session';
import { enrichWineList } from '@/ai/flows/enrich-wine-list';
import { revalidatePath } from 'next/cache';

// This is a mock DB call. In a real app, you would use Firestore.
let MOCK_WINE_CATALOG: any[] = [];

// Helper function to simulate batched writes to a mock DB
const mockBatchCommit = async (operations: any[]) => {
    return new Promise(resolve => {
        setTimeout(() => {
            operations.forEach(op => {
                if (op.type === 'delete') {
                    MOCK_WINE_CATALOG = [];
                }
                if (op.type === 'set') {
                     // In a real DB, you'd handle doc refs. Here we just push.
                    MOCK_WINE_CATALOG.push(op.data);
                }
            });
            console.log("Mock DB updated. Current catalog size:", MOCK_WINE_CATALOG.length);
            resolve(true);
        }, 500);
    });
}

export async function deleteAllWines() {
    const session = await getSession();
    if (session?.role !== 'admin') {
        throw new Error("Unauthorized");
    }

    // In a real app, you would get all docs and delete them in batches.
    await mockBatchCommit([{ type: 'delete' }]);

    revalidatePath('/admin/sommelier');
    return { success: true };
}

export async function bulkImportWines(wineNames: string[]) {
    const session = await getSession();
    if (session?.role !== 'admin') {
        throw new Error("Unauthorized");
    }

    if (wineNames.length === 0) {
        throw new Error("Wine list cannot be empty.");
    }

    // 1. Get enriched data from Genkit AI flow
    const { enrichedWines } = await enrichWineList({ wineNames });

    if (!enrichedWines || enrichedWines.length === 0) {
        throw new Error("AI failed to enrich the wine list.");
    }

    // 2. Prepare batch operations for mock DB
    const batchOps = enrichedWines.map((wine: any) => ({
        type: 'set',
        data: {
            name: wine.name,
            tags: wine.tags,
            createdAt: new Date(),
            category: 'wine'
        }
    }));
    
    // 3. Commit to mock DB
    await mockBatchCommit(batchOps);

    revalidatePath('/admin/sommelier');
    return { success: true, count: enrichedWines.length };
}

export async function getWineCatalog() {
    // In a real app, this would be a Firestore query.
    return Promise.resolve(MOCK_WINE_CATALOG);
}
