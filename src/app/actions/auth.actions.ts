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

export async function createSession(idToken: string) {
  const cookieStore = await cookies(); 
  
  let userRole: UserRole = 'customer';
  let uid: string;
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    uid = decodedToken.uid;

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const userRef = adminDb.collection('users').doc(uid);
    const userSnap = await userRef.get();
    
    if (userSnap.exists) {
        userRole = (userSnap.data()?.role as UserRole) || 'customer';
        await userRef.update({ lastLogin: new Date().toISOString() });
    } else {
        const authUser = await adminAuth.getUser(uid);
        const newUser: Partial<User> = {
            name: authUser.displayName || 'New User',
            email: authUser.email!,
            role: 'customer',
            customerSince: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            loyaltyStamps: 0,
        };
        await userRef.set(toPlainObject(newUser));
        userRole = 'customer';
    }
    
    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      sameSite: 'lax', 
      secure: process.env.NODE_ENV === 'production', 
      path: '/',
    });

  } catch (error: any) {
    console.error('CRITICAL SESSION ERROR:', error);
    if (error.digest?.includes('NEXT_REDIRECT')) {
        throw error;
    }
    throw new Error('Session creation failed');
  }

  const redirectPath = getRedirectPath(userRole);
  redirect(redirectPath);
}

const registerFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(5),
  street: z.string().min(3),
  city: z.string().min(2),
  zip: z.string().min(4),
  province: z.string().min(2),
  privacyPolicy: z.boolean().refine(val => val === true),
});


export async function registerUser(values: z.infer<typeof registerFormSchema>) {
    try {
        const { name, email, password, phone, street, city, zip, province, privacyPolicy } = registerFormSchema.parse(values);

        const userRecord = await adminAuth.createUser({
            email: email,
            password: password,
            displayName: name,
            emailVerified: false,
        });

        const userRef = adminDb.collection('users').doc(userRecord.uid);
        const newUser: Partial<User> = {
            name: name,
            email: email,
            role: 'customer',
            customerSince: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            loyaltyStamps: 0,
            phone: phone,
            deliveryAddress: { street, city, zip, province },
            consent: {
                privacyPolicy: {
                    accepted: privacyPolicy,
                    timestamp: new Date().toISOString(),
                }
            },
        };
        await userRef.set(toPlainObject(newUser));

        return { success: true };

    } catch (error: any) {
        let errorMessage = "Ein unerwarteter Fehler ist aufgetreten.";
        if (error.code === 'auth/email-already-exists') {
            errorMessage = "Diese E-Mail-Adresse wird bereits verwendet.";
        }
        console.error('Registration Error:', error);
        return { success: false, error: errorMessage };
    }
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

export async function deleteUserAccount() {
    const session = await getSession();
    if (!session?.userId) {
        return redirect('/login');
    }

    try {
        await adminDb.collection('users').doc(session.userId).delete();
        await adminAuth.deleteUser(session.userId);

    } catch (error) {
        console.error(`Failed to delete user ${session.userId}:`, error);
    }

    await logout();
}
