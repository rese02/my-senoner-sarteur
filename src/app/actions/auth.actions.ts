'use server'; // Das MUSS hier stehen!

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { UserRole } from '@/lib/types';

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
  let userRole: UserRole = 'customer';
  try {
    // 1. Token prüfen
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 2. Cookie vorbereiten (5 Tage)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // 3. Datenbank-Check (Selbstheilung!)
    const userRef = adminDb.collection('users').doc(uid);
    const userSnap = await userRef.get();
    
    if (userSnap.exists) {
        userRole = userSnap.data()?.role || 'customer';
    } else {
        // Wir nutzen 'set' mit 'merge: true'. Das repariert den User, falls er halb-kaputt ist.
        await userRef.set({
            id: uid,
            name: decodedToken.name || decodedToken.email,
            email: decodedToken.email,
            // Wir setzen die Rolle nur, wenn sie noch NICHT existiert.
            // So überschreiben wir einen Admin nicht versehentlich mit 'customer'.
            role: 'customer', 
            lastLogin: new Date(),
            loyaltyStamps: 0,
            customerSince: new Date().toISOString(),
        }, { merge: true });
    }


    // 4. Cookie setzen (WICHTIG: secure für die Cloud-Umgebung!)
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Nur false im Dev-Mode
      path: '/',
      sameSite: 'lax',
    });

  } catch (error) {
    console.error('CRITICAL SESSION ERROR:', error);
    // Wir werfen keinen Fehler, der die App crasht, sondern lassen den User 
    // im Zweifel zum Login zurück, damit er es nochmal probieren kann.
    redirect('/login?error=session_creation_failed');
    return;
  }

  // 5. Weiterleitung (Passiert nur, wenn kein Fehler oben war)
  const redirectPath = getRedirectPath(userRole);
  redirect(redirectPath);
}

export async function logout() {
  cookies().delete('session');
  redirect('/login');
}
