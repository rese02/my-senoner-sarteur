'use server';
import 'server-only';

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // The private key must have newline characters correctly escaped.
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const app: App = getApps().length 
  ? getApps()[0] 
  : initializeApp({ credential: cert(serviceAccount) });

export const adminAuth: Auth = getAuth(app);
export const adminDb: Firestore = getFirestore(app);