/**
 * Admin Collections API Route
 * 
 * Handles CRUD operations for hadith collections
 * 
 * @module api/admin/collections
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getCurrentUser, isAdmin } from '@/backend/lib/auth-server';

/**
 * GET - List all hadith collections
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const collections = await prisma.hadithCollection.findMany({
      include: {
        _count: {
          select: { hadiths: true, books: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: collections,
    });
  } catch (error) {
    console.error('[Admin Collections GET]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new hadith collection
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, nameArabic, compiler, compilerArabic, description } = body;

    if (!name || !compiler || !nameArabic) {
      return NextResponse.json(
        { error: 'Name, Arabic name, and compiler are required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const collection = await prisma.hadithCollection.create({
      data: {
        name,
        nameArabic,
        slug,
        compiler,
        compilerArabic: compilerArabic || null,
        description: description || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: collection,
    }, { status: 201 });
  } catch (error) {
    console.error('[Admin Collections POST]:', error);
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
