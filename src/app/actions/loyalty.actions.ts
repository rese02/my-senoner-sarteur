
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

/**
 * Adds a stamp to a user's account. Resets the stamp card if it's full.
 * Returns the updated user object.
 */
export async function addStamp(userId: string): Promise<User> {
    await requireRole(['employee', 'admin']);
    const validatedUserId = z.string().min(1).parse(userId);
    const userRef = adminDb.collection('users').doc(validatedUserId);

    let updatedUser: User | null = null;

    await adminDb.runTransaction(async (t) => {
        const doc = await t.get(userRef);
        if (!doc.exists) throw new Error("Kunde nicht gefunden");
        
        const userData = doc.data() as User;
        let currentStamps = userData.loyaltyStamps || 0;

        // If stamp card is full (10 stamps) and they get a new one, it resets.
        // This happens AFTER they redeem the 10-stamp prize.
        if (currentStamps >= 10) {
            currentStamps = 0;
        }
        
        const newStampCount = currentStamps + 1;
        
        const updateData = {
            loyaltyStamps: newStampCount,
            lastStampAt: new Date().toISOString()
        };
        
        t.update(userRef, updateData);
        
        updatedUser = toPlainObject({ ...userData, id: doc.id, ...updateData });
    });

    revalidatePath('/dashboard/loyalty');
    revalidatePath('/employee/scanner');
    
    if (!updatedUser) throw new Error("Failed to update user.");
    return updatedUser;
}

/**
 * Redeems a prize won from the Wheel of Fortune.
 */
export async function redeemPrize(userId: string): Promise<{ success: true }> {
    await requireRole(['employee', 'admin']);
    const validatedUserId = z.string().min(1).parse(userId);
    const userRef = adminDb.collection('users').doc(validatedUserId);
    
    const doc = await userRef.get();
    if (!doc.exists) throw new Error("Kunde nicht gefunden.");
    if (!doc.data()?.activePrize) throw new Error("Kunde hat keinen aktiven Gewinn zum Einlösen.");

    await userRef.update({
        activePrize: FieldValue.delete(),
    });

    revalidatePath('/dashboard/loyalty');
    revalidatePath('/employee/scanner');

    return { success: true };
}


/**
 * Redeems a stamp-based reward (3€ or 7€) and resets the stamp count.
 * Returns the updated user object.
 */
export async function redeemStampReward(userId: string, stampsToRedeem: 5 | 10): Promise<User> {
    await requireRole(['employee', 'admin']);

    const validatedUserId = z.string().min(1).parse(userId);
    const userRef = adminDb.collection('users').doc(validatedUserId);
    
    let updatedUser: User | null = null;

    await adminDb.runTransaction(async (t) => {
        const doc = await t.get(userRef);
        if (!doc.exists) throw new Error("Kunde nicht gefunden");

        const userData = doc.data() as User;
        const currentStamps = userData.loyaltyStamps || 0;

        if (currentStamps < stampsToRedeem) {
            throw new Error(`Nicht genügend Stempel. Benötigt: ${stampsToRedeem}, vorhanden: ${currentStamps}.`);
        }

        // Reset stamps to 0
        const updateData = { loyaltyStamps: 0 };
        t.update(userRef, updateData);
        updatedUser = toPlainObject({ ...userData, id: doc.id, ...updateData });
    });
    
    revalidatePath('/dashboard/loyalty');
    revalidatePath('/employee/scanner');

    if (!updatedUser) throw new Error("Failed to update user after redeeming stamp reward.");
    return updatedUser;
}
