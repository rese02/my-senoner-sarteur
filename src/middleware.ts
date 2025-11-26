'use server';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// WICHTIG: Importiere HIER KEINE eigenen Hilfsfunktionen aus /lib oder /actions!
// Keine 'getSession', keine 'firebase-admin', nichts.
// Die Middleware muss "dumm" bleiben.

export function middleware(request: NextRequest) {
  // 1. Wir prüfen nur, ob der Cookie existiert. Wir validieren ihn hier NICHT.
  // (Die Validierung passiert später im Layout/Page Server, wo Node.js verfügbar ist)
  const sessionCookie = request.cookies.get('session');

  const { pathname } = request.nextUrl;

  // Pfade definieren
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedRoute = 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/employee') || 
    pathname.startsWith('/dashboard');

  // REGEL 1: Wer eingeloggt ist (Cookie da), soll nicht auf Login/Register
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // REGEL 2: Wer NICHT eingeloggt ist (kein Cookie), darf nicht in geschützte Bereiche
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // REGEL 3: Root URL weiterleitung
  if (pathname === '/') {
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
