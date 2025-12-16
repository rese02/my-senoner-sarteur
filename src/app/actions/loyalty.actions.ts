
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

// Stempel hinzufügen
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
        
        const updateData: { loyaltyStamps: number; activePrize?: string | FieldValue, lastStampAt?: string } = {
            loyaltyStamps: newStampCount,
            lastStampAt: new Date().toISOString()
        };

        // Belohnung bei 5 oder 10 Stempeln hinzufügen
        // WICHTIG: Das Glücksrad ist ein separates System. Das hier sind die Stempel-Belohnungen.
        if (newStampCount === 5) {
            updateData.activePrize = '3€ Rabatt';
        } else if (newStampCount === 10) {
            updateData.activePrize = '7€ Rabatt';
        }
        
        t.update(userRef, updateData);
    });

    revalidatePath('/dashboard/loyalty');
    return { success: true };
}

// Gewinn einlösen
export async function redeemPrize(userId: string) {
    await requireRole(['employee', 'admin']);
    const validatedUserId = z.string().min(1).parse(userId);
    const userRef = adminDb.collection('users').doc(validatedUserId);
    
    const doc = await userRef.get();
    if (!doc.exists) {
        throw new Error("Kunde nicht gefunden.");
    }
    const userData = doc.data() as User;
    if (!userData.activePrize) {
        throw new Error("Kunde hat keinen aktiven Gewinn zum Einlösen.");
    }

    const prize = userData.activePrize;
    const updateData: { activePrize: FieldValue, loyaltyStamps?: number } = {
        activePrize: FieldValue.delete(),
    };
    
    // Logik für Stempelkarten-Rabatte: Stempel zurücksetzen nach Einlösung
    if (prize === '3€ Rabatt') {
        // Hier wird nichts zurückgesetzt, der User kann für die 10er-Marke weitersparen
    } else if (prize === '7€ Rabatt') {
        // Bei Einlösung der Hauptbelohnung wird die Karte zurückgesetzt
        updateData.loyaltyStamps = 0; 
    }

    await userRef.update(updateData);

    revalidatePath('/dashboard/loyalty');
    revalidatePath('/employee/scanner'); // Revalidate scanner to show updated user state

    return { success: true, prize };
}
    
