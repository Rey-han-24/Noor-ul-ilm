/**
 * API Route: Admin Users CRUD Operations
 * 
 * GET /api/admin/users - List all users (Admin only)
 * POST /api/admin/users - Create a new user (Super Admin only)
 * 
 * SECURITY: All routes require admin authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/lib/prisma';
import bcrypt from 'bcryptjs';
import { requireAdmin, requireSuperAdmin, isErrorResponse, logSecurityEvent } from '@/backend/lib/api-security';

/** Request body for creating a user */
interface CreateUserBody {
  email: string;
  password: string;
  name?: string;
  role?: 'USER' | 'ADMIN';
}

/**
 * GET /api/admin/users
 * Retrieves all users - Requires Admin
 */
export async function GET(request: NextRequest) {
  // ✅ SECURITY: Require admin authentication
  const authResult = await requireAdmin();
  if (isErrorResponse(authResult)) {
    logSecurityEvent('unauthorized_access', { route: '/api/admin/users', method: 'GET' });
    return authResult;
  }
  const admin = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    logSecurityEvent('admin_action', { 
      action: 'list_users', 
      adminId: admin.id, 
      adminEmail: admin.email,
      resultCount: users.length 
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Creates a new user - Requires Super Admin
 */
export async function POST(request: NextRequest) {
  // ✅ SECURITY: Require super admin for creating users
  const authResult = await requireSuperAdmin();
  if (isErrorResponse(authResult)) {
    logSecurityEvent('unauthorized_access', { route: '/api/admin/users', method: 'POST' });
    return authResult;
  }
  const admin = authResult;

  try {
    const body: CreateUserBody = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (body.password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'A user with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        password: hashedPassword,
        name: body.name?.trim() || 'User',
        role: body.role || 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    logSecurityEvent('admin_action', { 
      action: 'create_user', 
      adminId: admin.id, 
      adminEmail: admin.email,
      newUserId: user.id,
      newUserEmail: user.email,
      newUserRole: user.role
    });

    return NextResponse.json(
      { success: true, data: user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
