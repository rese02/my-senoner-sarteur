'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { z } from 'zod';

export async function createSession(idToken: string | null) {
  // SICHERHEITS-HÄRTUNG: Wenn kein Token vorhanden ist, sofort abbrechen.
  if (!idToken) {
    throw new Error('Authentication failed: No ID token provided.');
  }

  const getRedirectPath = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'employee':
        return '/employee/scanner';
      case 'customer':
      default:
        return '/dashboard';
    }
  };

  const cookieStore = await cookies();

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const userRef = adminDb.collection('users').doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      throw new Error('User profile not found in database. Please contact support.');
    }

    const userRole = (userSnap.data()?.role as UserRole) || 'customer';
    await userRef.update({ lastLogin: new Date().toISOString() });

    cookieStore.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,      // ZWINGEND TRUE für HTTPS/Cloud
      sameSite: 'none',  // ZWINGEND NONE für Cloud/iFrames
      path: '/',
    });

    const redirectPath = getRedirectPath(userRole);
    redirect(redirectPath);
  } catch (error: any) {
    console.error('CRITICAL SESSION ERROR:', error);
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    throw new Error('Session creation failed due to an internal error.');
  }
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
  privacyPolicy: z.boolean().refine((val) => val === true),
});

export async function registerUser(values: z.infer<typeof registerFormSchema>) {
  let userRecord;
  try {
    const { name, email, password, phone, street, city, zip, province, privacyPolicy } = registerFormSchema.parse(values);

    // 1. Auth-Benutzer erstellen
    userRecord = await adminAuth.createUser({
      email: email,
      password: password,
      displayName: name,
      emailVerified: false,
    });

    // 2. Firestore-Dokument erstellen
    const userRef = adminDb.collection('users').doc(userRecord.uid);
    const newUser: Omit<User, 'id'> = {
      name: name,
      email: email,
      role: 'customer', // Standard-Rolle für neue Benutzer
      customerSince: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      loyaltyStamps: 0,
      phone: phone,
      deliveryAddress: { street, city, zip, province },
      consent: {
        privacyPolicy: {
          accepted: privacyPolicy,
          timestamp: new Date().toISOString(),
        },
      },
    };
    await userRef.set(toPlainObject(newUser));

    // Send success response instead of redirecting from server action
    return { success: true };

  } catch (error: any) {
    // Rollback: Wenn Firestore fehlschlägt, lösche den Auth-Benutzer wieder
    if (userRecord) {
      await adminAuth.deleteUser(userRecord.uid).catch((deleteError) => {
        console.error('Failed to delete orphaned auth user:', deleteError);
      });
    }

    let errorMessage = 'Ein unerwarteter Fehler ist aufgetreten.';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Diese E-Mail-Adresse wird bereits verwendet.';
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
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
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
  };

  const validation = profileUpdateSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: 'Invalid data.',
      errors: validation.error.flatten().fieldErrors,
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
    },
  };

  try {
    await adminDb.collection('users').doc(session.userId).update(toPlainObject(dataToUpdate));
    revalidatePath('/dashboard/profile');
    return { success: true, message: 'Profil erfolgreich aktualisiert.' };
  } catch (error) {
    return { success: false, message: 'Aktualisierung fehlgeschlagen.' };
  }
}

export async function deleteUserAccount() {
  const session = await getSession();
  if (!session?.userId) {
    return redirect('/login');
  }

  try {
    // Zuerst das DB-Dokument löschen, dann den Auth-User
    await adminDb.collection('users').doc(session.userId).delete();
    await adminAuth.deleteUser(session.userId);
  } catch (error) {
    console.error(`Failed to delete user ${session.userId}:`, error);
    // Selbst wenn ein Fehler auftritt, versuchen wir auszuloggen
  }

  await logout();
}
