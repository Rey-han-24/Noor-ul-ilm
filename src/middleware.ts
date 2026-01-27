/**
 * Next.js Middleware
 * 
 * Handles route protection and authentication checks.
 * Runs on every request matching the configured paths.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware function - runs on matched routes
 */
export function middleware(request: NextRequest) {
  // Get the auth token from cookies
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Auth routes (login/signup) - redirect to dashboard if already logged in
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing auth routes with token, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware runs on
 */
export const config = {
  matcher: [
    // Match dashboard and all sub-routes
    '/dashboard/:path*',
    // Match auth routes
    '/login',
    '/signup',
  ],
};
