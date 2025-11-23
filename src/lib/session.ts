import 'server-only';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import type { UserRole } from '@/lib/types';


const COOKIE_NAME = 'session';

export async function getSession() {
  const sessionCookie = cookies().get(COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userDoc = await adminAuth.getUser(decodedToken.uid);
    const customClaims = (userDoc.customClaims || {}) as { role?: UserRole };

    return {
        userId: decodedToken.uid,
        role: (customClaims.role || 'customer') as UserRole,
        expiresAt: new Date(decodedToken.exp * 1000),
    }
  } catch (error) {
    // Session cookie is invalid or expired.
    // In a real app, you might want to log this error.
    return null;
  }
}

export async function deleteSession() {
  cookies().delete(COOKIE_NAME);
}
