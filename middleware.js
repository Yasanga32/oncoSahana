import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/blogs', '/ai-support', '/feedback', '/admin', '/profile'];
const AUTH_ROUTES = ['/login', '/register', '/reset-password'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // 1. Redirect guests trying to access protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    // Add original path as redirect param for better UX
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 2. Allow access to auth routes even if a token exists (to prevent stale cookie traps)
  // The client-side logic in LoginPage will handle redirecting truly logged-in users.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
