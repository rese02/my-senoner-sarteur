import 'server-only';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { UserRole } from './types';
import { toPlainObject } from './utils';


export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    // console.log("SESSION DEBUG: Kein Cookie gefunden"); // Optional
    return null;
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Wir holen die Daten, aber wenn DB fehlschlägt, lassen wir den User trotzdem rein (Fallback)
    let role: UserRole = 'customer';
    let userData = {};

    try {
        const userDoc = await adminDb.collection('users').doc(decodedClaims.uid).get();
        if (userDoc.exists) {
            const rawData = userDoc.data();
            userData = toPlainObject(rawData); // Ensure data is serializable
            role = (userData as any).role || 'customer';
        }
    } catch (dbError) {
        console.error("SESSION DEBUG: DB Fehler, aber Token ist gültig.", dbError);
    }

    return {
      userId: decodedClaims.uid,
      email: decodedClaims.email,
      name: (userData as any)?.name || 'No Name',
      role: role,
      ...userData
    };
  } catch (error) {
    // Session cookie is invalid or expired.
    console.error('SESSION DEBUG: Token ungültig:', error);
    return null;
  }
}