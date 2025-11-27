import 'server-only';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { UserRole } from './types';


export async function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  
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

    return {
      userId: decodedClaims.uid,
      email: decodedClaims.email,
      name: userData?.name || 'No Name',
      role: (userData?.role as UserRole) || 'customer',
      ...userData
    };
  } catch (error) {
    // Session cookie is invalid or expired.
    // In a real app, you might want to log this error.
    return null;
  }
}
