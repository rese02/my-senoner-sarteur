'use server';

import { getSession } from '@/lib/session';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

async function requireEmployeeOrAdmin() {
  const session = await getSession();
  if (!session || !['employee', 'admin'].includes(session.role)) {
    throw new Error("Unauthorized");
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

  if (purchaseAmount < RULES.MIN_PURCHASE) {
    throw new Error(`Einkauf muss mindestens ${RULES.MIN_PURCHASE}€ betragen.`);
  }

  const userRef = adminDb.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error("User not found");
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

  const cost = tier === 'big' ? RULES.REWARD_BIG.cost : RULES.REWARD_SMALL.cost;
  const discount = tier === 'big' ? RULES.REWARD_BIG.value : RULES.REWARD_SMALL.value;

  const userRef = adminDb.collection('users').doc(userId);

  // Firestore Transaction to ensure atomicity
  await adminDb.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists) {
      throw new Error("User not found");
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
