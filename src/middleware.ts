
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has('session');
  const url = request.nextUrl.clone();

  // Allow access to public pages like login, register, legal pages etc.
  const isPublicPage = ['/login', '/register', '/datenschutz', '/impressum'].some(path => url.pathname.startsWith(path));
  
  // Allow access to the test connection API route
  if (url.pathname.startsWith('/api/test-connection')) {
      return NextResponse.next();
  }
  
  // Root page should always redirect to login if no session
  if (url.pathname === '/' && !hasSession) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
  }

  // If trying to access a protected page without a session, redirect to login
  if (!hasSession && !isPublicPage && url.pathname !== '/') {
    url.pathname = '/login';
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If already has a session and tries to access login/register, redirect to the default dashboard.
  // This prevents logged-in users from seeing the login page again.
  if (hasSession && isPublicPage) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for static assets, images, and the favicon.
  matcher: [
    '/((?!api/test-connection|_next/static|_next/image|favicon.ico|logo.png|background-pattern.svg).*)',
  ],
};
