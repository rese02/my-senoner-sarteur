'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session';
import type { UserRole } from '@/lib/types';
import { initializeFirebase } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

// --- Schemas ---
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

// --- Helper Functions ---
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

// --- Server Actions ---

export async function login(credentials: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(credentials);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password } = validatedFields.data;
  const { auth, firestore } = initializeFirebase();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user role from Firestore
    const userDocRef = doc(firestore, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // This case should ideally not happen if registration is handled correctly
      return { error: 'User data not found in database.' };
    }

    const userData = userDoc.data();
    const role = userData.role || 'customer';

    await createSession(user.uid, role);
    
    return { redirectPath: getRedirectPath(role) };

  } catch (error: any) {
    console.error('Login error:', error.code);
    return { error: 'Invalid email or password.' };
  }
}

export async function register(data: z.infer<typeof RegisterSchema>) {
    const validatedFields = RegisterSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' };
    }

    const { name, email, password } = validatedFields.data;
    const { auth, firestore } = initializeFirebase();

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, {
            id: user.uid,
            name,
            email,
            role: 'customer',
            loyaltyStamps: 0,
            customerSince: new Date().toISOString(),
        });

        await createSession(user.uid, 'customer');
        
        revalidatePath('/');
        return { success: true };

    } catch (error: any) {
        console.error('Registration error:', error.code);
        if (error.code === 'auth/email-already-in-use') {
            return { error: 'An account with this email already exists.' };
        }
        return { error: 'Registration failed. Please try again.' };
    }
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
