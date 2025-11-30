
'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { UserRole } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';

function getRedirectPath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'employee':
      return '/employee/scanner';
    case 'customer':
    default:
      return '/dashboard';
  }
}

export async function createSession(idToken: string) {
  const cookieStore = await cookies(); 
  
  let userRole: UserRole = 'customer';
  
  try {
    console.log("Starte Session Erstellung...");

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    console.log("Token verifiziert für UID:", uid);

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    console.log("Session Cookie generiert.");

    const userRef = adminDb.collection('users').doc(uid);
    const userSnap = await userRef.get();
    
    if (userSnap.exists) {
        userRole = (userSnap.data()?.role as UserRole) || 'customer';
    } else {
        const newUser = {
            id: uid,
            name: decodedToken.name || decodedToken.email,
            email: decodedToken.email,
            role: 'customer', 
            customerSince: new Date(),
            lastLogin: new Date(),
            loyaltyStamps: 0,
        };
        await userRef.set(toPlainObject(newUser), { merge: true });
        console.log("Neuer User in DB erstellt:", uid);
    }
    
    console.log("Setze Cookie...");
    // 4. Cookie setzen (Optimiert für Cloud IDEs & HTTPS)
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      // 'none' ist wichtig für Cloud-Umgebungen/iFrames
      sameSite: 'none', 
      // Zwingend true, da Firebase Studio HTTPS nutzt
      secure: true, 
      path: '/',
    });
    console.log("Cookie gesetzt!");

  } catch (error: any) {
    // If the error is a redirect error, we must re-throw it so Next.js can handle it.
    if (error.digest?.includes('NEXT_REDIRECT')) {
        throw error;
    }
    console.error('CRITICAL SESSION ERROR:', error);
    // Wir werfen den Fehler weiter, damit die Login-Seite Bescheid weiß
    throw new Error('Session creation failed');
  }

  // Redirect NUR wenn alles oben geklappt hat
  const redirectPath = getRedirectPath(userRole);
  redirect(redirectPath);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}
