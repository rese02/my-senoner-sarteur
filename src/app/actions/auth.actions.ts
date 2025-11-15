'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session';
import { mockUsers } from '@/lib/mock-data';
import type { User, UserRole } from '@/lib/types';

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

  // In a real app, you'd query your database and verify the hashed password.
  const user = mockUsers.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return { error: 'Invalid email or password.' };
  }

  await createSession(user.id, user.role);
  
  return { redirectPath: getRedirectPath(user.role) };
}

export async function register(data: z.infer<typeof RegisterSchema>) {
    const validatedFields = RegisterSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' };
    }

    const { name, email, password } = validatedFields.data;
    
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
        return { error: 'An account with this email already exists.' };
    }

    // Create new user (mock)
    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        role: 'customer'
    };
    mockUsers.push(newUser);

    await createSession(newUser.id, newUser.role);
    
    return { success: true };
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
