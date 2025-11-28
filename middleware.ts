import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Wir prüfen NUR, ob der Cookie existiert (ohne ihn zu verifizieren)
  // Das ist sicher für die Edge Runtime.
  const hasSession = request.cookies.has('session');

  const isPublicRoute = PUBLIC_ROUTES.some(path => pathname.startsWith(path));

  // FALL A: User ist eingeloggt (Cookie da)
  if (hasSession) {
    // Wenn er versucht, sich nochmal einzuloggen -> ab zum Dashboard
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Ansonsten lassen wir ihn durch.
    // Die Prüfung, ob er wirklich "Admin" ist, macht dann die Admin-Seite selbst.
    return NextResponse.next();
  }

  // FALL B: User ist NICHT eingeloggt (Kein Cookie)
  else {
    // Er will auf eine geschützte Seite -> Ab zum Login
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      // Optional: Merken, wo er hin wollte
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

