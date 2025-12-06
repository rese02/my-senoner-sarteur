
'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { z } from 'zod';

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
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const userRef = adminDb.collection('users').doc(uid);
    const userSnap = await userRef.get();
    
    if (userSnap.exists) {
        userRole = (userSnap.data()?.role as UserRole) || 'customer';
        // If user exists, just update last login
        await userRef.update({ lastLogin: new Date().toISOString() });
    } else {
        // Enforce customer role on the server for all new sign-ups
        userRole = 'customer';
        const newUser: Partial<User> = {
            name: extraData?.name || decodedToken.name || decodedToken.email!,
            email: decodedToken.email!,
            role: userRole, 
            customerSince: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            loyaltyStamps: 0,
            phone: extraData?.phone || '',
            deliveryAddress: extraData?.deliveryAddress || { street: '', city: '', zip: '', province: '' },
            consent: extraData?.consent || { privacyPolicy: { accepted: false, timestamp: '' } },
        };
        await userRef.set(toPlainObject(newUser));
    }
    
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      sameSite: 'none', 
      secure: true, 
      path: '/',
    });

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

const profileUpdateSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  province: z.string().optional(),
});

export async function updateUserProfile(formData: FormData) {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, message: 'Not authenticated' };
  }

  const rawData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      street: formData.get('street'),
      city: formData.get('city'),
      zip: formData.get('zip'),
      province: formData.get('province'),
  }

  const validation = profileUpdateSchema.safeParse(rawData);

  if (!validation.success) {
      return { 
          success: false, 
          message: 'Invalid data.', 
          errors: validation.error.flatten().fieldErrors 
      };
  }
  
  const { name, phone, street, city, zip, province } = validation.data;

  const dataToUpdate = {
    name,
    phone,
    deliveryAddress: {
      street,
      city,
      zip,
      province,
    }
  };

  try {
    await adminDb.collection('users').doc(session.userId).update(toPlainObject(dataToUpdate));
    revalidatePath('/dashboard/profile');
    return { success: true, message: 'Profil erfolgreich aktualisiert.' };
  } catch(error) {
    return { success: false, message: 'Aktualisierung fehlgeschlagen.' };
  }
}
