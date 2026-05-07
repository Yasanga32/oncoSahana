import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/blogs', '/ai-support', '/feedback', '/admin', '/profile'];
const AUTH_ROUTES = ['/login', '/register', '/reset-password'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // 1. Skip middleware for static assets and API routes (though matcher should handle this)
  if (pathname.includes('.') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. Redirect guests trying to access protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    // Don't redirect if we're already going to login to prevent loops
    if (pathname === '/login') return NextResponse.next();
    
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 3. Optional: Redirect logged-in users away from auth pages
  // But we keep it open for now to allow "stale cookie" fixes as per your previous design
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
