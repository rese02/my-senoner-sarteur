import 'server-only'; // Ganz wichtig! Schützt vor Client-Nutzung.

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

// Wir prüfen, ob die Keys da sind. Wenn nicht, werfen wir sofort einen Fehler, damit du es merkst.
if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('FEHLER: Firebase Admin Keys fehlen in .env.local');
}

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Der Replace-Trick ist zwingend nötig für Vercel/Cloud-Umgebungen
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

// Singleton: Verhindert, dass die App versucht, sich 2x zu verbinden (Crash-Ursache)
const app: App = getApps().length 
  ? getApps()[0] 
  : initializeApp({ credential: cert(serviceAccount) });

export const adminAuth: Auth = getAuth(app);
export const adminDb: Firestore = getFirestore(app);
