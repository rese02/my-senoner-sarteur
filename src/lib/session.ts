
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
    
    // IMMER die neuesten Daten aus der DB holen, um veraltete Rollen im Cookie zu vermeiden.
    const userDoc = await adminDb.collection('users').doc(decodedClaims.uid).get();
    if (!userDoc.exists) {
        // Wenn der DB-User nicht existiert, ist die Session ungültig.
        return null;
    }
    const userData = userDoc.data();
    
    const role = (userData?.role as UserRole) || 'customer';

    // Wir bauen das Session-Objekt mit den FRISCHEN Daten aus der DB
    const sessionUser: User = {
      id: decodedClaims.uid,
      email: decodedClaims.email!,
      name: userData?.name || 'No Name',
      role: role,
      ...toPlainObject(userData), // Fügt alle anderen DB-Felder hinzu (loyaltyStamps etc.)
    };

    return sessionUser;
  } catch (error) {
    // Wenn das Cookie ungültig ist (abgelaufen, manipuliert), wird der User abgemeldet.
    console.warn("Session cookie verification failed. User logged out.", error);
    return null;
  }
}
