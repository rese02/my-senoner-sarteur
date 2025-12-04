
'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';

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

export async function createSession(idToken: string, extraData?: Partial<User>) {
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
        // If user exists, just update last login
        await userRef.update({ lastLogin: new Date().toISOString() });
    } else {
        // Enforce customer role on the server for all new sign-ups
        userRole = 'customer';
        const newUser: Omit<User, 'id'> = {
            name: extraData?.name || decodedToken.name || decodedToken.email!,
            email: decodedToken.email!,
            role: userRole, 
            customerSince: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            loyaltyStamps: 0,
            phone: extraData?.phone || '',
            deliveryAddress: extraData?.deliveryAddress || { street: '', city: '', zip: '', province: '' },
        };
        await userRef.set(toPlainObject(newUser));
        console.log("Neuer User in DB erstellt:", uid);
    }
    
    console.log("Setze Cookie...");
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      sameSite: 'none', 
      secure: true, 
      path: '/',
    });
    console.log("Cookie gesetzt!");

  } catch (error) {
    console.error('CRITICAL SESSION ERROR:', error);
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

export async function updateUserProfile(formData: FormData) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Not authenticated');
  }

  const dataToUpdate = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    deliveryAddress: {
      street: formData.get('street') as string,
      city: formData.get('city') as string,
      zip: formData.get('zip') as string,
      province: formData.get('province') as string,
    }
  };

  try {
    await adminDb.collection('users').doc(session.userId).update(toPlainObject(dataToUpdate));
    revalidatePath('/dashboard/profile');
    return { success: true, message: 'Profil erfolgreich aktualisiert.' };
  } catch(error) {
    console.error("Profile update failed:", error);
    return { success: false, message: 'Aktualisierung fehlgeschlagen.' };
  }
}
