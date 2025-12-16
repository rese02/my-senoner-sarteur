
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

// 1. Mitarbeiter gibt Punkte (Scan)
export async function addPointsToUser(userId: string, points: number) {
    await requireRole(['employee', 'admin']);

    const validatedUserId = z.string().min(1).parse(userId);
    const validatedPoints = z.number().positive().parse(points);

    if (validatedPoints <= 0) throw new Error("Ungültige Punktzahl");

    const userRef = adminDb.collection('users').doc(validatedUserId);

    await adminDb.runTransaction(async (t) => {
        const doc = await t.get(userRef);
        if (!doc.exists) throw new Error("Kunde nicht gefunden");
        
        t.update(userRef, { 
            loyaltyPoints: FieldValue.increment(validatedPoints),
            lastPointUpdate: new Date().toISOString()
        });
    });

    revalidatePath('/dashboard/loyalty');
    return { success: true, addedPoints: validatedPoints };
}


// 2. Glücksrad drehen (Kunde)
const PRIZES = [
    { id: 'lose', label: 'Niete', chance: 50 },
    { id: 'small', label: '10% Rabatt', chance: 30 },
    { id: 'medium', label: 'Gratis Kaffee', chance: 15 },
    { id: 'jackpot', label: 'Geschenkkorb', chance: 5 },
];
const WHEEL_SPIN_COST = 50;

export async function spinWheelAndGetPrize() {
    const session = await requireRole(['customer']);
    
    const userRef = adminDb.collection('users').doc(session.userId);

    const result = await adminDb.runTransaction(async (t) => {
        const doc = await t.get(userRef);
        if (!doc.exists) throw new Error("Benutzer nicht gefunden.");
        
        const currentPoints = doc.data()?.loyaltyPoints || 0;

        if (currentPoints < WHEEL_SPIN_COST) {
            throw new Error(`Nicht genug Punkte! Du brauchst ${WHEEL_SPIN_COST}.`);
        }

        // Punkte abziehen
        t.update(userRef, { loyaltyPoints: FieldValue.increment(-WHEEL_SPIN_COST) });

        // Gewinn ermitteln (Weighted Random)
        const random = Math.random() * 100;
        let cumulative = 0;
        let wonPrize = PRIZES[0]; // Default to 'lose'

        for (const prize of PRIZES) {
            cumulative += prize.chance;
            if (random <= cumulative) {
                wonPrize = prize;
                break;
            }
        }
        
        // Gewinn in einer Unterkollektion speichern
        if (wonPrize.id !== 'lose') {
             const rewardRef = userRef.collection('rewards').doc();
             t.set(rewardRef, {
                 prizeId: wonPrize.id,
                 label: wonPrize.label,
                 createdAt: new Date().toISOString(),
                 redeemed: false,
             });
        }

        return { 
            prize: wonPrize, 
            remainingPoints: currentPoints - WHEEL_SPIN_COST 
        };
    });

    revalidatePath('/dashboard/loyalty');
    return result;
}

// Stempel-Funktionen sind jetzt veraltet und werden entfernt oder angepasst.
// Die bestehende `redeemPrize` und `redeemReward` Logik muss überarbeitet werden,
// um mit der neuen `rewards` Unterkollektion zu arbeiten, falls das gewünscht ist.
// Fürs Erste entfernen wir sie, um Konflikte zu vermeiden.

export async function redeemPrize(userId: string) {
    await requireRole(['employee', 'admin']);
    // Diese Funktion muss neu implementiert werden, um aus der `rewards` Collection zu lesen und zu löschen.
    console.log("redeemPrize needs reimplementation for new points system");
    return { success: false, message: "Funktion nicht implementiert."};
}

export async function addStamp(userId: string, purchaseAmount: number) {
    console.log("addStamp is deprecated, use addPointsToUser");
    return { success: false, message: "Veraltete Funktion."};
}
export async function redeemReward(userId: string, tier: 'small' | 'big') {
    console.log("redeemReward is deprecated");
     return { success: false, message: "Veraltete Funktion."};
}
