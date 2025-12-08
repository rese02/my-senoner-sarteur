'use server';

import { redirect } from 'next/navigation';

// Die Komponente ist nun async, was die empfohlene Methode für serverseitige Weiterleitungen ist.
export default async function HomePage() {
  // Sofortige, serverseitige Umleitung zur Login-Seite.
  // Dies ist der sicherste und performanteste Weg, um die Startseite zu schützen.
  redirect('/login');
}
