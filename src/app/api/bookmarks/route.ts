/**
 * Bookmark API Routes
 * 
 * Handles CRUD operations for user bookmarks (Quran verses and Hadith)
 * 
 * @module api/bookmarks
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getCurrentUser } from '@/backend/lib/auth-server';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createBookmarkSchema = z.object({
  type: z.enum(['QURAN', 'HADITH']),
  surahNumber: z.number().int().min(1).max(114).optional(),
  ayahNumber: z.number().int().min(1).optional(),
  collectionId: z.string().optional(),
  hadithNumber: z.number().int().min(1).optional(),
  note: z.string().max(500).optional(),
}).refine(
  (data) => {
    if (data.type === 'QURAN') {
      return data.surahNumber !== undefined && data.ayahNumber !== undefined;
    }
    if (data.type === 'HADITH') {
      return data.collectionId !== undefined && data.hadithNumber !== undefined;
    }
    return false;
  },
  {
    message: 'Invalid bookmark data. Quran requires surahNumber and ayahNumber. Hadith requires collectionId and hadithNumber.',
  }
);

// ============================================
// GET - Fetch User Bookmarks
// ============================================

/**
 * Retrieves all bookmarks for the authenticated user
 * 
 * @param request - Next.js request object
 * @returns JSON response with bookmarks array
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to view bookmarks.' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'QURAN' | 'HADITH' | null;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Build query filter
    const whereClause: Record<string, unknown> = {
      userId: user.id,
    };

    if (type && ['QURAN', 'HADITH'].includes(type)) {
      whereClause.type = type;
    }

    // Fetch bookmarks with pagination
    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bookmark.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        bookmarks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });

  } catch (error) {
    console.error('[Bookmarks GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks. Please try again.' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Create New Bookmark
// ============================================

/**
 * Creates a new bookmark for the authenticated user
 * 
 * @param request - Next.js request object with bookmark data
 * @returns JSON response with created bookmark
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to create bookmarks.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = createBookmarkSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { type, surahNumber, ayahNumber, collectionId, hadithNumber, note } = validationResult.data;

    // Check for duplicate bookmark
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId: user.id,
        type,
        ...(type === 'QURAN' && { surahNumber, ayahNumber }),
        ...(type === 'HADITH' && { collectionId, hadithNumber }),
      },
    });

    if (existingBookmark) {
      return NextResponse.json(
        { error: 'This content is already bookmarked.' },
        { status: 409 }
      );
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: user.id,
        type,
        surahNumber: type === 'QURAN' ? surahNumber : null,
        ayahNumber: type === 'QURAN' ? ayahNumber : null,
        collectionId: type === 'HADITH' ? collectionId : null,
        hadithNumber: type === 'HADITH' ? hadithNumber : null,
        note,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Bookmark created successfully.',
      data: bookmark,
    }, { status: 201 });

  } catch (error) {
    console.error('[Bookmarks POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark. Please try again.' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Remove Bookmark
// ============================================

/**
 * Deletes a bookmark by ID for the authenticated user
 * 
 * @param request - Next.js request object
 * @returns JSON response confirming deletion
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to delete bookmarks.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get('id');

    if (!bookmarkId) {
      return NextResponse.json(
        { error: 'Bookmark ID is required.' },
        { status: 400 }
      );
    }

    // Find and verify ownership
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found.' },
        { status: 404 }
      );
    }

    if (bookmark.userId !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this bookmark.' },
        { status: 403 }
      );
    }

    // Delete bookmark
    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json({
      success: true,
      message: 'Bookmark deleted successfully.',
    });

  } catch (error) {
    console.error('[Bookmarks DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete bookmark. Please try again.' },
      { status: 500 }
    );
  }
}
