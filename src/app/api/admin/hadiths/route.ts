/**
 * Admin Hadiths API Route
 * 
 * Handles bulk hadith operations
 * 
 * @module api/admin/hadiths
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getCurrentUser, isAdmin } from '@/backend/lib/auth-server';

/**
 * GET - List hadiths with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('collectionId');
    const bookId = searchParams.get('bookId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const whereClause: Record<string, unknown> = {};
    
    if (collectionId) {
      whereClause.collectionId = collectionId;
    }
    
    if (bookId) {
      whereClause.bookId = bookId;
    }

    const [hadiths, total] = await Promise.all([
      prisma.hadith.findMany({
        where: whereClause,
        orderBy: { hadithNumber: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          collection: {
            select: { name: true, slug: true },
          },
        },
      }),
      prisma.hadith.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        hadiths,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('[Admin Hadiths GET]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hadiths' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new hadith
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
    const { 
      collectionId, 
      bookId,
      hadithNumber,
      hadithNumberInBook,
      arabicText, 
      englishText,
      narratorChain,
      primaryNarrator,
      grade,
      reference,
      inBookReference,
      chapterNumber,
      chapterTitle,
    } = body;

    if (!collectionId || !hadithNumber || !arabicText || !englishText) {
      return NextResponse.json(
        { error: 'collectionId, hadithNumber, arabicText, and englishText are required' },
        { status: 400 }
      );
    }

    const hadith = await prisma.hadith.create({
      data: {
        collectionId,
        bookId: bookId || null,
        hadithNumber,
        hadithNumberInBook: hadithNumberInBook || null,
        arabicText,
        englishText,
        narratorChain: narratorChain || null,
        primaryNarrator: primaryNarrator || null,
        grade: grade || 'UNKNOWN',
        reference: reference || null,
        inBookReference: inBookReference || null,
        chapterNumber: chapterNumber || null,
        chapterTitle: chapterTitle || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: hadith,
    }, { status: 201 });
  } catch (error) {
    console.error('[Admin Hadiths POST]:', error);
    return NextResponse.json(
      { error: 'Failed to create hadith' },
      { status: 500 }
    );
  }
}
