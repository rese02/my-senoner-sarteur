import 'server-only';
import { initializeApp, getApps, getApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Wir prüfen, ob die Keys da sind, um klare Fehlermeldungen zu geben.
if (!process.env.FIREBASE_PRIVATE_KEY) {
  console.error("❌ FEHLER: FIREBASE_PRIVATE_KEY fehlt in der .env-Datei");
}
if (!process.env.FIREBASE_CLIENT_EMAIL) {
  console.error("❌ FEHLER: FIREBASE_CLIENT_EMAIL fehlt in der .env-Datei");
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error("❌ FEHLER: FIREBASE_PROJECT_ID fehlt in der .env-Datei");
}

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Dieser Trick repariert die Zeilenumbrüche im Key:
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
} as ServiceAccount;


// Singleton Pattern: Verhindert doppelten Start und Fehler im Hot-Reload
const app = getApps().length > 0 
  ? getApp() 
  : initializeApp({
      credential: cert(serviceAccount),
    });

const adminDb = getFirestore(app);
const adminAuth = getAuth(app);

export { adminDb, adminAuth };
