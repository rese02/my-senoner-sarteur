'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

// IMPORTANT: This export forces the middleware to run on the Node.js runtime.
// This is required because getSession() uses firebase-admin, which is not compatible
// with the default 'edge' runtime.
export const runtime = 'nodejs';

const PUBLIC_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();

  const isPublicRoute = PUBLIC_ROUTES.some(path => pathname.startsWith(path));

  if (session) {
    const { role } = session;
    let userHomePage = '/dashboard'; // Default for customer
    if (role === 'admin') userHomePage = '/admin/dashboard';
    if (role === 'employee') userHomePage = '/employee/scanner';
    
    // If user is logged in and tries to access a public route, redirect them to their home page
    if (isPublicRoute) {
      return NextResponse.redirect(new URL(userHomePage, request.url));
    }

    // Role-based access control
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(userHomePage, request.url));
    }
    if (pathname.startsWith('/employee') && role !== 'employee' && role !== 'admin') { // Admins can access employee routes
      return NextResponse.redirect(new URL(userHomePage, request.url));
    }
    if (pathname.startsWith('/dashboard') && role !== 'customer') {
      return NextResponse.redirect(new URL(userHomePage, request.url));
    }
    
  } else {
    // If user is not logged in and tries to access a protected route, redirect to login
    if (!isPublicRoute && pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for static assets, API routes, and Next.js internals
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};