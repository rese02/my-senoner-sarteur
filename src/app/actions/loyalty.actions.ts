
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
    
    // Wir geben alles zurück: Name, Punkte UND den aktiven Gewinn
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
        
        t.update(userRef, { 
            loyaltyStamps: FieldValue.increment(1),
            lastPointUpdate: new Date().toISOString()
        });
    });

    revalidatePath('/dashboard/loyalty');
    // Kein Revalidate für Scanner nötig, da die Daten eh neu gefetched werden
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
    
    await userRef.update({ activePrize: FieldValue.delete() });

    revalidatePath('/dashboard/loyalty');

    return { success: true, prize: prize };
}
    
