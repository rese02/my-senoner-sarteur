'use server';
import 'server-only';
import admin from 'firebase-admin';

// This file is for server-side code only.

// Prevent re-initialization in development
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Use `JSON.parse` to handle the escaped newlines in the private key from env variables
        privateKey: process.env.FIREBASE_PRIVATE_KEY
          ? JSON.parse(`"${process.env.FIREBASE_PRIVATE_KEY}"`)
          : undefined,
      }),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
