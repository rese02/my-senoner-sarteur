import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/admin', '/employee'];
const PUBLIC_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  const isProtectedRoute = PROTECTED_ROUTES.some(path => pathname.startsWith(path));

  // If the user has no session cookie and is trying to access a protected route,
  // redirect them to the login page.
  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user has a session cookie and is trying to access a public route (like login),
  // we'll let the page's logic handle the redirect. This is simpler and avoids
  // a flash of content. The page itself will redirect to the correct dashboard.

  return NextResponse.next();
}

export const config = {
  // Match all routes except for static assets, API routes, and Next.js internals
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
