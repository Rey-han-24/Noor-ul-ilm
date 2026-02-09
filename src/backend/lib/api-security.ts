/**
 * API Security Utilities
 * 
 * Provides authentication and authorization helpers for API routes
 * CRITICAL: Use these in ALL admin API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, AUTH_COOKIE_NAME, SafeUser } from '@/shared/utils/auth';
import prisma from './prisma';

/**
 * Standard API error responses
 */
export const ApiErrors = {
  UNAUTHORIZED: { error: 'Authentication required', code: 'UNAUTHORIZED' },
  FORBIDDEN: { error: 'Access denied', code: 'FORBIDDEN' },
  NOT_FOUND: { error: 'Resource not found', code: 'NOT_FOUND' },
  BAD_REQUEST: { error: 'Invalid request', code: 'BAD_REQUEST' },
  INTERNAL_ERROR: { error: 'Internal server error', code: 'INTERNAL_ERROR' },
} as const;

/**
 * Gets the current user from the request (for API routes)
 * Returns null if not authenticated
 */
export async function getApiUser(): Promise<SafeUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    // Verify user still exists and get fresh data
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return user as SafeUser | null;
  } catch {
    return null;
  }
}

/**
 * Requires authentication - returns user or error response
 */
export async function requireAuth(): Promise<SafeUser | NextResponse> {
  const user = await getApiUser();
  
  if (!user) {
    return NextResponse.json(ApiErrors.UNAUTHORIZED, { status: 401 });
  }
  
  return user;
}

/**
 * Requires admin privileges - returns user or error response
 */
export async function requireAdmin(): Promise<SafeUser | NextResponse> {
  const user = await getApiUser();
  
  if (!user) {
    return NextResponse.json(ApiErrors.UNAUTHORIZED, { status: 401 });
  }
  
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return NextResponse.json(ApiErrors.FORBIDDEN, { status: 403 });
  }
  
  return user;
}

/**
 * Requires super admin privileges - returns user or error response
 */
export async function requireSuperAdmin(): Promise<SafeUser | NextResponse> {
  const user = await getApiUser();
  
  if (!user) {
    return NextResponse.json(ApiErrors.UNAUTHORIZED, { status: 401 });
  }
  
  if (user.role !== 'SUPER_ADMIN') {
    return NextResponse.json(ApiErrors.FORBIDDEN, { status: 403 });
  }
  
  return user;
}

/**
 * Type guard to check if result is a NextResponse (error)
 */
export function isErrorResponse(result: SafeUser | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}

/**
 * Rate limiting store (in-memory - use Redis in production)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple rate limiter
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Get client IP from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Log security events (extend this to use proper logging service)
 */
export function logSecurityEvent(
  event: 'login' | 'logout' | 'failed_login' | 'unauthorized_access' | 'admin_action',
  details: Record<string, unknown>
): void {
  const timestamp = new Date().toISOString();
  console.log(`[SECURITY ${timestamp}] ${event}:`, JSON.stringify(details));
  
  // TODO: In production, send to logging service (e.g., Sentry, LogRocket)
}
