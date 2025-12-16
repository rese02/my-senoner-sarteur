
'use server';

import { adminDb } from '@/lib/firebase-admin';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import type { User } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

// Helper for strict role checks
async function requireRole(roles: Array<'customer' | 'employee' | 'admin'>) {
    const session = await getSession();
    if (!session || !roles.includes(session.role)) {
        throw new Error('Unauthorized');
    }
    return session;
}

export async function addStamp(userId: string, purchaseAmount: number) {
    await requireRole(['employee', 'admin']);

    const validatedUserId = z.string().min(1).parse(userId);
    // const validatedAmount = z.number().positive().parse(purchaseAmount);

    const userRef = adminDb.collection('users').doc(validatedUserId);

    await adminDb.runTransaction(async (t) => {
        const doc = await t.get(userRef);
        if (!doc.exists) throw new Error("Kunde nicht gefunden");
        
        const currentStamps = doc.data()?.loyaltyStamps || 0;
        
        if (currentStamps >= 10) {
            // Optional: prevent adding more stamps if card is full
            // throw new Error("Stempelkarte ist bereits voll.");
            // Or just do nothing. For now, we allow it.
        }

        t.update(userRef, { 
            loyaltyStamps: FieldValue.increment(1),
            lastPointUpdate: new Date().toISOString()
        });
    });

    revalidatePath('/dashboard/loyalty');
    return { success: true };
}

export async function redeemReward(userId: string, tier: 'small' | 'big') {
    await requireRole(['employee', 'admin']);
    
    const validatedUserId = z.string().min(1).parse(userId);
    
    const userRef = adminDb.collection('users').doc(validatedUserId);

    await adminDb.runTransaction(async (t) => {
        const doc = await t.get(userRef);
        if (!doc.exists) throw new Error("Kunde nicht gefunden");

        const currentStamps = doc.data()?.loyaltyStamps || 0;
        const requiredStamps = tier === 'small' ? 5 : 10;
        
        if (currentStamps < requiredStamps) {
            throw new Error(`Nicht genug Stempel für diese Prämie. Benötigt: ${requiredStamps}, vorhanden: ${currentStamps}`);
        }

        t.update(userRef, { loyaltyStamps: FieldValue.increment(-requiredStamps) });
    });

    revalidatePath('/dashboard/loyalty');
    return { success: true, redeemedTier: tier };
}


// This action is now only used for the Wheel of Fortune
export async function redeemPrize(userId: string) {
    await requireRole(['employee', 'admin']);
    const validatedUserId = z.string().min(1).parse(userId);
    const userRef = adminDb.collection('users').doc(validatedUserId);
    
    const doc = await userRef.get();
    if (!doc.exists || !doc.data()?.activePrize) {
        throw new Error("Kunde hat keinen aktiven Gewinn zum Einlösen.");
    }
    
    await userRef.update({ activePrize: null });

    revalidatePath('/dashboard/loyalty');
    revalidatePath('/admin/customers');

    return { success: true, prize: doc.data()?.activePrize };
}



// Deprecated functions, kept for reference but should not be used.
export async function addPointsToUser(userId: string, points: number) {
    console.warn("addPointsToUser is deprecated, use addStamp instead");
    return { success: false, message: "Veraltete Funktion."};
}
export async function spinWheelAndGetPrize() {
    console.warn("spinWheelAndGetPrize is deprecated");
     return { success: false, message: "Veraltete Funktion."};
}
