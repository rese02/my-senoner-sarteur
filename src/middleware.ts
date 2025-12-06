import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/impressum', '/datenschutz'];
const PROTECTED_ROUTES_PREFIXES = ['/dashboard', '/admin', '/employee'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has('session');

  const isPublicRoute = PUBLIC_ROUTES.some(path => pathname.startsWith(path));

  // If the user has a session (is logged in)
  if (hasSession) {
    // And tries to access a public-only route like login/register
    if (isPublicRoute) {
      // Redirect them to their default dashboard.
      // The role-specific redirect will be handled by the createSession logic if they just logged in,
      // but this is a good catch-all for already logged-in users.
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } 
  // If the user does NOT have a session (is not logged in)
  else {
    // And tries to access a protected route
    const isProtectedRoute = PROTECTED_ROUTES_PREFIXES.some(prefix => pathname.startsWith(prefix));
    if (isProtectedRoute) {
      // Redirect them to the login page.
      const loginUrl = new URL('/login', request.url);
      // Optional: You could add a callbackUrl to redirect them back after login
      // loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to proceed if none of the above conditions are met.
  // This correctly covers:
  // - Logged-in users accessing protected routes.
  // - Not-logged-in users accessing public routes (like /register).
  return NextResponse.next();
}

export const config = {
  // Match all routes except for API, static files, images, and other special files.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|background-pattern.svg).*)'],
};
