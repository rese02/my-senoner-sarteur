'use server';

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
  // NEXT.JS 15+ CHANGE: We must now wait for cookies()
  const cookieStore = await cookies(); 
  
  let userRole: UserRole = 'customer';
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const userRef = adminDb.collection('users').doc(uid);
    const userSnap = await userRef.get();
    
    if (userSnap.exists) {
        userRole = (userSnap.data()?.role as UserRole) || 'customer';
    } else {
        await userRef.set({
            id: uid,
            name: decodedToken.name || decodedToken.email,
            email: decodedToken.email,
            role: 'customer', 
            lastLogin: new Date(),
            loyaltyStamps: 0,
            customerSince: new Date().toISOString(),
        }, { merge: true });
    }

    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

  } catch (error) {
    console.error('CRITICAL SESSION ERROR:', error);
    redirect('/login?error=session_creation_failed');
  }

  const redirectPath = getRedirectPath(userRole);
  redirect(redirectPath);
}

export async function logout() {
  // NEXT.JS 15+ CHANGE: We must now wait for cookies()
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}
