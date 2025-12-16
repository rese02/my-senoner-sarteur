
import 'server-only';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import type { User, UserRole } from './types';
import { toPlainObject } from './utils';


export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // User Daten holen
    const userDoc = await adminDb.collection('users').doc(decodedClaims.uid).get();
    if (!userDoc.exists) {
        return null;
    }
    const userData = userDoc.data();
    
    const role = (userData?.role as UserRole) || 'customer';

    const plainUserData = userData ? toPlainObject(userData) : {};

    return {
      id: decodedClaims.uid, // KORREKTUR: von userId zu id
      userId: decodedClaims.uid,
      email: decodedClaims.email,
      name: (plainUserData as any)?.name || 'No Name',
      role: role,
      ...plainUserData
    } as User & { userId: string };
  } catch (error) {
    return null;
  }
}
