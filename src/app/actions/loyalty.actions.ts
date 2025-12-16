
'use server';

import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import type { User } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { toPlainObject } from '@/lib/utils';

// Helper for strict role checks
async function requireRole(roles: Array<'customer' | 'employee' | 'admin'>) {
    const session = await getSession();
    if (!session || !roles.includes(session.role)) {
        throw new Error('Unauthorized');
    }
    return session;
}

// --- MITARBEITER ACTIONS ---

// 1. Kunde scannen und Daten holen
export async function getCustomerDetails(userId: string): Promise<User> {
    await requireRole(['employee', 'admin']);
    const validatedId = z.string().min(1).parse(userId);

    const doc = await adminDb.collection('users').doc(validatedId).get();
    if (!doc.exists) throw new Error("Kunde nicht gefunden");
    
    // Wir geben alles zurück: Name, Stempel UND den aktiven Gewinn
    return toPlainObject({ id: doc.id, ...doc.data() } as User);
}

// 2. Stempel hinzufügen
export async function addStamp(userId: string) {
    await requireRole(['employee', 'admin']);

    const validatedUserId = z.string().min(1).parse(userId);
    
    const userRef = adminDb.collection('users').doc(validatedUserId);

    await adminDb.runTransaction(async (t) => {
        const doc = await t.get(userRef);
        if (!doc.exists) throw new Error("Kunde nicht gefunden");
        
        let currentStamps = doc.data()?.loyaltyStamps || 0;

        // Wenn Stempelkarte voll (10 Stempel), wird sie zurückgesetzt.
        if (currentStamps >= 10) {
            currentStamps = 0;
        }
        
        const newStampCount = currentStamps + 1;

        // Wenn die 5er oder 10er Marke erreicht wird, generiere den Rabatt als "activePrize"
        let newPrize: string | null = null;
        if (newStampCount === 5) {
            newPrize = '3€ Rabatt';
        } else if (newStampCount === 10) {
            newPrize = '7€ Rabatt';
        }
        
        const updateData: { loyaltyStamps: number; activePrize?: string | FieldValue, lastPointUpdate: string } = {
            loyaltyStamps: newStampCount,
            lastPointUpdate: new Date().toISOString()
        };

        if (newPrize) {
            // Wenn schon ein Preis da ist, nicht überschreiben. An der Kasse entscheiden.
            // In einer echten App würde man das komplexer handhaben (z.B. Array von Preisen).
            // Fürs Erste: Der neue Gewinn wird nur gesetzt, wenn keiner da ist.
            const existingPrize = doc.data()?.activePrize;
            if (!existingPrize) {
                updateData.activePrize = newPrize;
            }
        }
        
        t.update(userRef, updateData);
    });

    revalidatePath('/dashboard/loyalty');
    return { success: true };
}

// 3. Gewinn einlösen (Löscht ihn aus dem Profil)
export async function redeemPrize(userId: string) {
    await requireRole(['employee', 'admin']);
    const validatedUserId = z.string().min(1).parse(userId);
    const userRef = adminDb.collection('users').doc(validatedUserId);
    
    const doc = await userRef.get();
    if (!doc.exists || !doc.data()?.activePrize) {
        throw new Error("Kunde hat keinen aktiven Gewinn zum Einlösen.");
    }
    const prize = doc.data()?.activePrize;
    
    // Logik für Stempelkarten-Rabatte
    if (prize === '3€ Rabatt' || prize === '7€ Rabatt') {
         await userRef.update({ 
            activePrize: FieldValue.delete(),
            // Stempel werden NICHT zurückgesetzt. Das passiert beim nächsten Stempel, wenn die Karte voll ist.
        });
    } else {
        // Logik für andere Gewinne (z.B. vom Glücksrad)
        await userRef.update({ activePrize: FieldValue.delete() });
    }


    revalidatePath('/dashboard/loyalty');

    return { success: true, prize: prize };
}
    
