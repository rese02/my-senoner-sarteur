import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // WICHTIG: Wir prüfen nur, ob der Cookie existiert.
  // Wir importieren NICHTS aus @/lib/session oder firebase-admin!
  const hasSession = request.cookies.has('session');

  const isPublicRoute = PUBLIC_ROUTES.some(path => pathname.startsWith(path));

  // FALL A: User hat einen Cookie
  if (hasSession) {
    // Wenn er auf Login will -> Dashboard
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Sonst darf er passieren. Ob er Admin ist, prüft die Seite selbst, nicht die Middleware.
    return NextResponse.next();
  }

  // FALL B: Kein Cookie
  else {
    // Er will auf eine geschützte Seite -> Login
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
