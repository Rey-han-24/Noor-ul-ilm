/**
 * Login API Route
 * POST /api/auth/login
 * Authenticates user and creates session
 * 
 * SECURITY: Includes rate limiting and brute force protection
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '@/backend/lib/prisma';
import { createToken, AUTH_COOKIE_NAME } from '@/shared/utils/auth';
import { checkRateLimit, getClientIp, logSecurityEvent } from '@/backend/lib/api-security';

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  // ✅ SECURITY: Rate limiting - 5 login attempts per minute per IP
  if (!checkRateLimit(`login:${clientIp}`, 5, 60000)) {
    logSecurityEvent('failed_login', { 
      reason: 'rate_limit_exceeded', 
      ip: clientIp 
    });
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      logSecurityEvent('failed_login', { 
        reason: 'user_not_found', 
        email: email.toLowerCase(),
        ip: clientIp 
      });
      // Generic error to prevent email enumeration
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      logSecurityEvent('failed_login', { 
        reason: 'invalid_password', 
        userId: user.id,
        email: user.email,
        ip: clientIp 
      });
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN' | 'SUPER_ADMIN',
    });

    // Set cookie with security flags
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,                                    // ✅ Prevents XSS access
      secure: process.env.NODE_ENV === 'production',    // ✅ HTTPS only in prod
      sameSite: 'lax',                                  // ✅ CSRF protection
      maxAge: 60 * 60 * 24 * 7,                         // 7 days
      path: '/',
    });

    logSecurityEvent('login', { 
      userId: user.id,
      email: user.email,
      ip: clientIp 
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
