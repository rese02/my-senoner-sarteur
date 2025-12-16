
'use server';

import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import type { User, UserRole } from '@/lib/types';
import { toPlainObject } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';

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
      sameSite: 'lax',  // 'lax' ist ein sicherer Standard für die meisten Fälle
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
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: z.string().min(5, "Invalid phone number."),
  street: z.string().min(3, "Invalid street."),
  city: z.string().min(2, "Invalid city."),
  zip: z.string().min(4, "Invalid ZIP code."),
  province: z.string().min(2, "Invalid province."),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy.",
  }),
  marketingConsent: z.boolean().optional(),
});

export async function registerUser(values: unknown) {
  const validation = registerFormSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, error: 'Invalid data provided. Please check all fields.' };
  }

  const { name, email, password, phone, street, city, zip, province, privacyPolicy, marketingConsent } = validation.data;
  
  let userRecord;
  try {
    // 1. Auth-Benutzer erstellen
    userRecord = await adminAuth.createUser({
      email: email,
      password: password,
      displayName: name,
      emailVerified: false,
    });

    // 2. Firestore-Dokument erstellen
    const userRef = adminDb.collection('users').doc(userRecord.uid);
    const now = new Date().toISOString();
    const newUser: Omit<User, 'id'> = {
      name: name,
      email: email,
      role: 'customer', // Standard-Rolle für neue Benutzer
      customerSince: now,
      lastLogin: now,
      loyaltyStamps: 0,
      phone: phone,
      deliveryAddress: { street, city, zip, province },
      consent: {
        privacyPolicy: {
          accepted: privacyPolicy,
          timestamp: now,
        },
        marketing: {
          accepted: marketingConsent ?? false,
          timestamp: now,
        },
         profiling: { // Default consent for profiling
          accepted: marketingConsent ?? false,
          timestamp: now,
        }
      },
    };
    await userRef.set(toPlainObject(newUser));

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
  marketingConsent: z.string().optional(),
  profilingConsent: z.string().optional(),
});

export async function updateUserProfile(formData: FormData) {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, message: 'Not authenticated' };
  }

  const rawData = Object.fromEntries(formData.entries());
  
  const validation = profileUpdateSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: 'Invalid data: ' + validation.error.flatten().fieldErrors,
    };
  }

  const { name, phone, street, city, zip, province, marketingConsent, profilingConsent } = validation.data;

  const dataToUpdate: any = {};
  const now = new Date().toISOString();

  // Only add fields if they are actually being updated
  if (name) dataToUpdate.name = name;
  if (phone !== undefined) dataToUpdate.phone = phone;

  if (street !== undefined || city !== undefined || zip !== undefined || province !== undefined) {
      dataToUpdate['deliveryAddress.street'] = street || '';
      dataToUpdate['deliveryAddress.city'] = city || '';
      dataToUpdate['deliveryAddress.zip'] = zip || '';
      dataToUpdate['deliveryAddress.province'] = province || '';
  }

  if (marketingConsent !== undefined) {
    dataToUpdate['consent.marketing'] = {
        accepted: marketingConsent === 'on',
        timestamp: now,
    };
  }
   if (profilingConsent !== undefined) {
    dataToUpdate['consent.profiling'] = {
        accepted: profilingConsent === 'on',
        timestamp: now,
    };
  }


  try {
    await adminDb.collection('users').doc(session.userId).update(dataToUpdate);
    revalidatePath('/dashboard/profile');
    return { success: true, message: 'Profil erfolgreich aktualisiert.' };
  } catch (error: any) {
    console.error("Profile update failed:", error.message);
    return { success: false, message: 'Aktualisierung fehlgeschlagen.' };
  }
}

export async function deleteUserAccount() {
  const session = await getSession();
  if (!session?.userId) {
    return redirect('/login');
  }

  const userId = session.userId;

  try {
    const batch = adminDb.batch();

    // 1. Alle Bestellungen des Nutzers zum Löschen finden und zum Batch hinzufügen
    const ordersQuery = adminDb.collection('orders').where('userId', '==', userId);
    const ordersSnapshot = await ordersQuery.get();
    ordersSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // 2. Das Benutzerdokument zum Löschen zum Batch hinzufügen
    const userRef = adminDb.collection('users').doc(userId);
    batch.delete(userRef);
    
    // 3. Den Batch ausführen, um alle DB-Einträge zu löschen
    await batch.commit();

    // 4. Den Auth-User löschen, nachdem die DB-Einträge entfernt wurden
    await adminAuth.deleteUser(userId);
    
  } catch (error) {
    console.error(`Failed to completely delete user ${userId}:`, error);
    // Selbst wenn ein Fehler auftritt, versuchen wir auszuloggen
  }

  await logout();
}
