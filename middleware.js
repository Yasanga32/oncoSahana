import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/blogs', '/ai-support', '/feedback', '/admin', '/profile'];
const AUTH_ROUTES = ['/login', '/register', '/reset-password'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // 1. Skip middleware for static assets, public files, and icons
  if (
    pathname.includes('.') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') ||
    pathname.includes('favicon')
  ) {
    return NextResponse.next();
  }

  // 2. Redirect guests trying to access protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute && !token) {
    // Only redirect if we are NOT already on the login page
    if (pathname === '/login') return NextResponse.next();
    
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
