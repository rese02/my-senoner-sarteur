'use server';

import { redirect } from 'next/navigation';

export default async function HomePage() {
  // Sofortige, serverseitige Umleitung zur Login-Seite.
  // Dies ist der sicherste Weg, um die Startseite zu schützen.
  redirect('/login');
}
