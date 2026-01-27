/**
 * Signup API Route
 * POST /api/auth/signup
 * Creates a new user account
 * 
 * SECURITY: Includes rate limiting and input validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { createToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { checkRateLimit, getClientIp, logSecurityEvent, sanitizeInput, isValidEmail } from '@/lib/api-security';

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  // ✅ SECURITY: Rate limiting - 3 signups per hour per IP
  if (!checkRateLimit(`signup:${clientIp}`, 3, 3600000)) {
    logSecurityEvent('unauthorized_access', { 
      reason: 'signup_rate_limit_exceeded', 
      ip: clientIp 
    });
    return NextResponse.json(
      { error: 'Too many signup attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // ✅ SECURITY: Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // ✅ SECURITY: Strong password requirements
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // ✅ SECURITY: Validate name length
    if (name.trim().length < 2 || name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // ✅ SECURITY: Hash password with strong cost factor
    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ SECURITY: Sanitize name input
    const sanitizedName = sanitizeInput(name.trim());

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: sanitizedName,
        role: UserRole.USER,  // ✅ Always create as regular USER
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

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

    logSecurityEvent('admin_action', { 
      action: 'user_signup',
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
