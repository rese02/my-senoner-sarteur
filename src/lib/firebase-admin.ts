import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// 1. Service Account vorbereiten
// Wir prüfen, ob die Variablen da sind, um kryptische Fehler zu vermeiden.
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  // Warnung im Terminal, falls Keys fehlen (App stürzt nicht sofort ab, aber Auth geht nicht)
  console.error("⚠️ FEHLER: Firebase Admin Environment Variablen fehlen in .env.local");
}

const serviceAccount = {
  projectId,
  clientEmail,
  // WICHTIG: Ersetzt \\n durch echte Zeilenumbrüche (für Vercel/Hosting)
  privateKey: privateKey ? privateKey.replace(/\\n/g, '\n') : undefined,
};

// 2. Initialisierung (Singleton Pattern)
// Wir prüfen: Gibt es schon eine App? Wenn ja, nimm die. Wenn nein, starte neu.
const app = getApps().length > 0 
  ? getApp() 
  : initializeApp({
      credential: cert(serviceAccount),
    });

// 3. Exportiere die Instanzen
export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
