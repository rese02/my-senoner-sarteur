import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function GET() {
  const results = {
    env: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Gefunden" : "❌ FEHLT",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? "✅ Gefunden" : "❌ FEHLT",
      privateKey: process.env.FIREBASE_PRIVATE_KEY 
        ? `✅ Gefunden (Länge: ${process.env.FIREBASE_PRIVATE_KEY.length} Zeichen)` 
        : "❌ FEHLT",
    },
    auth: "⏳ Teste...",
    database: "⏳ Teste..."
  };

  console.log("\n--- START SYSTEM DIAGNOSE ---");
  console.log("1. Environment Check:", results.env);

  // TEST 1: Firebase Authentication Verbindung
  try {
    // Versuchen, max. 1 User abzurufen
    const listUsersResult = await adminAuth.listUsers(1);
    results.auth = `✅ ERFOLG! Verbunden. Gefundene User: ${listUsersResult.users.length}`;
    console.log("2. Auth Test:", results.auth);
  } catch (error: any) {
    results.auth = `❌ FEHLER: ${error.message}`;
    console.error("2. Auth Test GESCHEITERT:", error);
  }

  // TEST 2: Firestore Datenbank Verbindung
  try {
    // Versuchen, die Collections zu lesen
    const collections = await adminDb.listCollections();
    const collectionNames = collections.map(col => col.id).join(", ");
    results.database = `✅ ERFOLG! Verbunden. Collections: ${collectionNames || "Keine (Leer)"}`;
    console.log("3. DB Test:", results.database);
  } catch (error: any) {
    results.database = `❌ FEHLER: ${error.message}`;
    console.error("3. DB Test GESCHEITERT:", error);
  }

  console.log("--- DIAGNOSE ENDE ---\n");

  return NextResponse.json(results);
}
