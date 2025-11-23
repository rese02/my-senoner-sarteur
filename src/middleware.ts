
import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

// IMPORTANT: This middleware runs in the Node.js runtime, NOT the edge.
// This is crucial because getSession() uses firebase-admin, which requires Node.js APIs.
export const runtime = 'nodejs';

const PUBLIC_ROUTES = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();

  const isPublicRoute = PUBLIC_ROUTES.some(path => pathname.startsWith(path));

  if (session) {
    const { role } = session;
    const userHomePage = role === 'admin' ? '/admin/dashboard' : role === 'employee' ? '/employee/scanner' : '/dashboard';

    // If user is logged in and tries to access a public route, redirect them to their home page
    if (isPublicRoute) {
      return NextResponse.redirect(new URL(userHomePage, request.url));
    }

    // Check role-based access
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(userHomePage, request.url));
    }
    if (pathname.startsWith('/employee') && role !== 'employee' && role !== 'admin') {
       return NextResponse.redirect(new URL(userHomePage, request.url));
    }
    if (pathname.startsWith('/dashboard') && role !== 'customer') {
      return NextResponse.redirect(new URL(userHomePage, request.url));
    }
    
  } else {
    // If user is not logged in and tries to access a protected route, redirect to login
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all routes except for static assets, API routes, and Next.js internals
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
