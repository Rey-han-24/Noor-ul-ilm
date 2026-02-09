/**
 * Authentication utilities
 * 
 * IMPORTANT: This file re-exports ONLY client-safe utilities.
 * 
 * For server-only functions (like getCurrentUser), import directly from:
 *   import { getCurrentUser } from '@/backend/lib/auth-server'
 * 
 * For shared functions (tokens, types), import from this file or auth-shared:
 *   import { createToken, verifyToken } from '@/shared/utils/auth'
 */

// Re-export shared utilities (safe for client and server)
export {
  AUTH_COOKIE_NAME,
  createToken,
  verifyToken,
  type UserRole,
  type JwtPayload,
  type SafeUser,
} from './auth-shared';

// DO NOT re-export server-only utilities here!
// Import them directly from '@/backend/lib/auth-server' in Server Components
