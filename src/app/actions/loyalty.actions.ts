'use server';

import { getSession } from '@/lib/session';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Strikte Berechtigungsprüfung: Nur Mitarbeiter oder Admins dürfen diese Aktionen ausführen.
async function requireEmployeeOrAdmin() {
  const session = await getSession();
  if (!session || !['employee', 'admin'].includes(session.role)) {
    throw new Error("Unauthorized: Employee or Admin access required.");
  }
}

const RULES = {
  MIN_PURCHASE: 15,
  REWARD_SMALL: { cost: 5, value: 3 },
  REWARD_BIG: { cost: 10, value: 7 }
};

// 1. Stempel vergeben (Nur Employee/Admin)
export async function addStamp(userId: string, purchaseAmount: number) {
  await requireEmployeeOrAdmin();
  
  // Strikte Eingabevalidierung mit Zod
  const schema = z.object({
    userId: z.string().min(1),
    purchaseAmount: z.number().positive(),
  });
  const validation = schema.safeParse({ userId, purchaseAmount });
  if (!validation.success) {
    throw new Error("Ungültige Eingabedaten.");
  }
  const data = validation.data;


  if (data.purchaseAmount < RULES.MIN_PURCHASE) {
    throw new Error(`Einkauf muss mindestens ${RULES.MIN_PURCHASE}€ betragen.`);
  }

  const userRef = adminDb.collection('users').doc(data.userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error("Benutzer nicht gefunden.");
  }
  
  await userRef.update({
    loyaltyStamps: FieldValue.increment(1)
  });

  revalidatePath('/employee/scanner');
  revalidatePath('/dashboard/loyalty');
  
  return { success: true, message: "Stempel hinzugefügt" };
}

// 2. Belohnung einlösen (Nur Employee/Admin)
export async function redeemReward(userId: string, tier: 'small' | 'big') {
  await requireEmployeeOrAdmin();

  // Strikte Eingabevalidierung mit Zod
  const schema = z.object({
    userId: z.string().min(1),
    tier: z.enum(['small', 'big']),
  });
  const validation = schema.safeParse({ userId, tier });
  if (!validation.success) {
    throw new Error("Ungültige Eingabedaten.");
  }
  const data = validation.data;

  const cost = data.tier === 'big' ? RULES.REWARD_BIG.cost : RULES.REWARD_SMALL.cost;
  const discount = data.tier === 'big' ? RULES.REWARD_BIG.value : RULES.REWARD_SMALL.value;

  const userRef = adminDb.collection('users').doc(data.userId);

  // Atomare Transaktion, um Race Conditions zu verhindern
  await adminDb.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) {
      throw new Error("Benutzer nicht gefunden.");
    }

    const currentStamps = userDoc.data()?.loyaltyStamps || 0;
    if (currentStamps < cost) {
      throw new Error("Nicht genügend Stempel!");
    }
    
    transaction.update(userRef, {
      loyaltyStamps: FieldValue.increment(-cost)
    });
  });

  revalidatePath('/employee/scanner');
  revalidatePath('/dashboard/loyalty');
  
  return { success: true, discountAmount: discount };
}


// 3. Gewinn vom Glücksrad einlösen (Nur Employee/Admin)
export async function redeemPrize(userId: string) {
    await requireEmployeeOrAdmin();

    const validatedUserId = z.string().min(1).parse(userId);
    const userRef = adminDb.collection('users').doc(validatedUserId);
    
    const userDoc = await userRef.get();
    if (!userDoc.exists || !userDoc.data()?.activePrize) {
        throw new Error("Kein aktiver Gewinn für diesen Benutzer gefunden.");
    }

    await userRef.update({
        activePrize: FieldValue.delete() // Löscht das Feld aus dem Dokument
    });

    revalidatePath('/employee/scanner');
    revalidatePath('/dashboard/loyalty');

    return { success: true, message: "Gewinn eingelöst." };
}
