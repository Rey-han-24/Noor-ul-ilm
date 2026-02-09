/**
 * Server-only Authentication Utilities
 * 
 * This file contains auth functions that use server-only features like cookies.
 * Only import this file in Server Components and API routes.
 */

import 'server-only';

import { cookies } from 'next/headers';
import prisma from './prisma';
import { verifyToken, AUTH_COOKIE_NAME, SafeUser } from '@/shared/utils/auth-shared';

/**
 * Gets the current authenticated user from cookies (server-side)
 * Use this in Server Components and API routes
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
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

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return null;
    }

    return user as SafeUser;
  } catch {
    return null;
  }
}

/**
 * Checks if user has admin privileges
 */
export function isAdmin(user: SafeUser | null): boolean {
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
}

/**
 * Checks if user has super admin privileges
 */
export function isSuperAdmin(user: SafeUser | null): boolean {
  return user?.role === 'SUPER_ADMIN';
}
