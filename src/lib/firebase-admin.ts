import 'server-only';
// ⚠️ WICHTIG: Hier darf AUF KEINEN FALL "use server" stehen!
// "use server" gehört nur in Actions, nicht in Datenbank-Verbindungen.

import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

// Wir bauen das Zertifikat aus den Env-Vars zusammen
// Achte darauf, dass deine .env.local korrekt befüllt ist
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Singleton Pattern: Verhindert, dass die App mehrfach initialisiert wird
const app: App = getApps().length 
  ? getApps()[0] 
  : initializeApp({ credential: cert(serviceAccount) });

// Das sind die Objekte, wegen denen "use server" verboten ist:
export const adminAuth: Auth = getAuth(app);
export const adminDb: Firestore = getFirestore(app);
