import 'server-only';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { UserRole } from './types';
import { toPlainObject } from './utils';


export async function getSession() {
  // NEXT.JS 15/16 FIX: await cookies()
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  
  if (!sessionCookie) return null;

  try {
    // 1. Cookie verifizieren (Das geht nur im Node.js Server, nicht Middleware)
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // 2. User Daten aus Firestore holen (für die Rolle)
    const userDoc = await adminDb.collection('users').doc(decodedClaims.uid).get();
    
    if (!userDoc.exists) {
        // This case can happen if the user is deleted from Firestore but the cookie still exists
        cookies().delete('session');
        redirect('/login');
    }

    const userData = userDoc.data();

    // The FIX: Convert Firestore data (with Timestamps) to a plain object
    const plainUserData = toPlainObject(userData);

    return {
      userId: decodedClaims.uid,
      email: decodedClaims.email,
      name: plainUserData?.name || 'No Name',
      role: (plainUserData?.role as UserRole) || 'customer',
      ...plainUserData
    };
  } catch (error) {
    // Session cookie is invalid or expired.
    // In a real app, you might want to log this error.
    return null;
  }
}
