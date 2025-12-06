import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/impressum', '/datenschutz'];
const PROTECTED_ROUTES_PREFIXES = ['/dashboard', '/admin', '/employee'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has('session');

  const isPublicRoute = PUBLIC_ROUTES.some(path => pathname.startsWith(path));
  const isProtectedRoute = PROTECTED_ROUTES_PREFIXES.some(prefix => pathname.startsWith(prefix));

  if (hasSession) {
    // If user has a session and tries to access a public route (like login),
    // redirect them to their dashboard.
    if (isPublicRoute) {
      // The actual role-based redirect happens in the createSession action.
      // Here, we can just send them to a generic dashboard path.
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // If user does NOT have a session and tries to access a protected route,
    // redirect them to the login page.
    if (isProtectedRoute) {
       const loginUrl = new URL('/login', request.url);
       // Optional: You can add a callback URL to redirect them back after login
       // loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
       return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to proceed if none of the above conditions are met.
  // This covers:
  // - Logged-in users accessing protected routes.
  // - Not-logged-in users accessing public routes (like /register).
  return NextResponse.next();
}

export const config = {
  // Match all routes except for API, static files, and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|background-pattern.svg).*)'],
};
