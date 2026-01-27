/**
 * API Route: Hadith Books CRUD Operations
 * 
 * GET /api/admin/books - List all books with filtering
 * POST /api/admin/books - Create a new book
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/** Request body for creating a book */
interface CreateBookBody {
  name: string;
  nameArabic: string;
  collectionId: string;
  bookNumber?: number;
  totalHadiths?: number;
  order?: number;
}

/**
 * GET /api/admin/books
 * Retrieves all books, optionally filtered by collection
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('collection');

    const where = collectionId ? { collectionId } : {};

    const books = await prisma.hadithBook.findMany({
      where,
      include: {
        collection: true,
        _count: {
          select: {
            hadiths: true,
          },
        },
      },
      orderBy: [
        { collection: { order: 'asc' } },
        { order: 'asc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/books
 * Creates a new book in a collection
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateBookBody = await request.json();

    // Validate required fields
    if (!body.name || !body.nameArabic || !body.collectionId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: name, nameArabic, and collectionId are required' 
        },
        { status: 400 }
      );
    }

    // Verify collection exists
    const collection = await prisma.hadithCollection.findUnique({
      where: { id: body.collectionId },
    });

    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Create the book
    const book = await prisma.hadithBook.create({
      data: {
        name: body.name,
        nameArabic: body.nameArabic,
        collectionId: body.collectionId,
        bookNumber: body.bookNumber,
        totalHadiths: body.totalHadiths || 0,
        order: body.order ?? 0,
      },
      include: {
        collection: true,
      },
    });

    return NextResponse.json(
      { success: true, data: book },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
