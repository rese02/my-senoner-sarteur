'use server';

import { getSession } from '@/lib/session';
import { mockUsers } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';
import type { User, UserRole } from '@/lib/types';


// In a real Firebase app, you would use the Firebase Admin SDK to perform these operations
// on your Firestore database, including using FieldValue.increment().
// For this mock data setup, we'll manipulate the mockUsers array directly.

const RULES = {
  MIN_PURCHASE: 15,
  REWARD_SMALL: { cost: 5, value: 3 },
  REWARD_BIG: { cost: 10, value: 7 }
};

// 1. Stempel vergeben (Nur Employee)
export async function addStamp(userId: string, purchaseAmount: number) {
  const session = await getSession();
  if (session?.role !== 'employee' && session?.role !== 'admin') {
    throw new Error("Unauthorized");
  }

  if (purchaseAmount < RULES.MIN_PURCHASE) {
    throw new Error(`Einkauf muss mindestens ${RULES.MIN_PURCHASE}€ betragen.`);
  }

  // --- MOCK DB UPDATE ---
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  
  const currentStamps = mockUsers[userIndex].loyaltyStamps || 0;
  mockUsers[userIndex].loyaltyStamps = currentStamps + 1;
  // --- END MOCK DB UPDATE ---

  revalidatePath('/employee/scanner');
  revalidatePath('/dashboard/loyalty');
  
  return { success: true, message: "Stempel hinzugefügt" };
}

// 2. Belohnung einlösen (Nur Employee)
export async function redeemReward(userId: string, tier: 'small' | 'big') {
  const session = await getSession();
  if (session?.role !== 'employee' && session?.role !== 'admin') {
    throw new Error("Unauthorized");
  }

  const cost = tier === 'big' ? RULES.REWARD_BIG.cost : RULES.REWARD_SMALL.cost;
  const discount = tier === 'big' ? RULES.REWARD_BIG.value : RULES.REWARD_SMALL.value;

  // --- MOCK DB TRANSACTION ---
  const userIndex = mockUsers.findIndex(u => u.id === userId);
   if (userIndex === -1) {
    throw new Error("User not found");
  }

  const currentStamps = mockUsers[userIndex].loyaltyStamps || 0;
  if (currentStamps < cost) {
    throw new Error("Nicht genügend Stempel!");
  }
  
  mockUsers[userIndex].loyaltyStamps = currentStamps - cost;
  // --- END MOCK DB TRANSACTION ---

  revalidatePath('/employee/scanner');
  revalidatePath('/dashboard/loyalty');
  
  return { success: true, discountAmount: discount };
}
