'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { UserRole } from '@/lib/types';
import { revalidatePath } from 'next/cache';

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

// This function is called AFTER the user has successfully signed in or registered on the client.
export async function createSession(idToken: string) {
  try {
    // 1. Verify the ID token passed from the client.
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 2. Check if the user document exists in Firestore.
    const userDocRef = adminDb.collection('users').doc(uid);
    const userDoc = await userDocRef.get();
    
    let userRole: UserRole = 'customer'; // Default role

    if (!userDoc.exists) {
      // 4a. If user does NOT exist (first registration), create the document.
       await userDocRef.set({
        id: uid,
        name: decodedToken.name || decodedToken.email,
        email: decodedToken.email,
        role: 'customer',
        loyaltyStamps: 0,
        customerSince: new Date().toISOString(),
      });
    } else {
       // 4b. If user DOES exist, get their role.
       userRole = userDoc.data()?.role || 'customer';
    }

    // 3. Generate the session cookie.
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // 4. Set the cookie on the browser.
    // We set 'secure' to false in development to avoid issues in cloud IDEs.
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    // 5. Redirect based on role.
    const redirectPath = getRedirectPath(userRole);
    revalidatePath(redirectPath);
    redirect(redirectPath);

  } catch (error) {
    console.error('Session creation failed:', error);
    // You might want to clear any client-side auth state here if possible
    throw new Error('Authentication process failed on the server.');
  }
}

export async function logout() {
  // Clear the session cookie.
  cookies().delete('session');
  // Redirect to the login page.
  redirect('/login');
}
