/**
 * Public API Route: Get Hadiths by Collection
 * 
 * GET /api/hadiths/[collection] - Get hadiths from a specific collection
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';

/** Route parameters */
interface RouteParams {
  params: Promise<{ collection: string }>;
}

/**
 * GET /api/hadiths/[collection]
 * Returns hadiths from a specific collection with pagination
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { collection: collectionSlug } = await params;
    const { searchParams } = new URL(request.url);
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const bookNumber = searchParams.get('book');

    // Find the collection by slug
    const collection = await prisma.hadithCollection.findUnique({
      where: { slug: collectionSlug },
      select: {
        id: true,
        name: true,
        nameArabic: true,
        slug: true,
        compiler: true,
        totalHadiths: true,
      },
    });

    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Build where clause
    const where: Record<string, unknown> = {
      book: {
        collectionId: collection.id,
      },
    };

    // Filter by book number if provided
    if (bookNumber) {
      where.book = {
        ...where.book as object,
        bookNumber: parseInt(bookNumber),
      };
    }

    // Fetch hadiths with pagination
    const [hadiths, total] = await Promise.all([
      prisma.hadith.findMany({
        where,
        select: {
          id: true,
          hadithNumber: true,
          arabicText: true,
          englishText: true,
          primaryNarrator: true,
          grade: true,
          gradedBy: true,
          chapterTitle: true,
          reference: true,
          book: {
            select: {
              id: true,
              name: true,
              nameArabic: true,
              bookNumber: true,
            },
          },
        },
        orderBy: [
          { book: { bookNumber: 'asc' } },
          { hadithNumber: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.hadith.count({ where }),
    ]);

    // Get list of books in this collection
    const books = await prisma.hadithBook.findMany({
      where: { collectionId: collection.id },
      select: {
        id: true,
        name: true,
        nameArabic: true,
        bookNumber: true,
        totalHadiths: true,
      },
      orderBy: { bookNumber: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: {
        collection,
        books,
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
    console.error('Error fetching hadiths:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hadiths' },
      { status: 500 }
    );
  }
}
