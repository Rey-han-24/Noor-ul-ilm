/**
 * Shared Authentication Utilities
 * 
 * This file contains auth utilities that can be safely imported
 * in both client and server components. Does NOT use cookies or
 * other server-only features.
 */

import jwt from 'jsonwebtoken';

/** 
 * JWT secret - MUST be set in environment variables for production
 * Throws error if not set in production environment
 */
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  
  // Fallback for development only
  return secret || 'dev-secret-do-not-use-in-production';
};

const JWT_SECRET = getJwtSecret();

/** Token expiration time */
const TOKEN_EXPIRY = '7d';

/** Cookie name for auth token */
export const AUTH_COOKIE_NAME = 'auth_token';

/** User roles */
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

/** JWT payload structure */
export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

/** Safe user object (no password) */
export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * Creates a JWT token for a user
 */
export function createToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verifies and decodes a JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
