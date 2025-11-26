'use server';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  const isPublicRoute = PUBLIC_ROUTES.some(path => pathname.startsWith(path));

  // If a session cookie exists and the user is on a public route,
  // redirect them to a default dashboard. We can't know their role here.
  if (sessionCookie && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If no session cookie and the route is protected, redirect to login.
  if (!sessionCookie && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for static assets, API routes, and Next.js internals
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
