/**
 * API Route: Individual Hadith Operations
 * 
 * GET /api/admin/hadiths/[id] - Get a single hadith
 * PUT /api/admin/hadiths/[id] - Update a hadith
 * DELETE /api/admin/hadiths/[id] - Delete a hadith
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';
import { HadithGrade } from '@prisma/client';

/** Route parameters */
interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Request body for updating a hadith */
interface UpdateHadithBody {
  hadithNumber?: number;
  arabicText?: string;
  englishText?: string;
  primaryNarrator?: string;
  narratorChain?: string;
  grade?: HadithGrade;
  gradedBy?: string;
  bookId?: string;
  chapterTitle?: string;
  reference?: string;
  inBookReference?: string;
}

/**
 * GET /api/admin/hadiths/[id]
 * Retrieves a single hadith by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const hadith = await prisma.hadith.findUnique({
      where: { id },
      include: {
        book: {
          include: {
            collection: true,
          },
        },
      },
    });

    if (!hadith) {
      return NextResponse.json(
        { success: false, error: 'Hadith not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: hadith });
  } catch (error) {
    console.error('Error fetching hadith:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hadith' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/hadiths/[id]
 * Updates an existing hadith
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body: UpdateHadithBody = await request.json();

    // Check if hadith exists
    const existingHadith = await prisma.hadith.findUnique({
      where: { id },
    });

    if (!existingHadith) {
      return NextResponse.json(
        { success: false, error: 'Hadith not found' },
        { status: 404 }
      );
    }

    // Validate grade if provided
    if (body.grade && !Object.values(HadithGrade).includes(body.grade)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid grade. Must be one of: ${Object.values(HadithGrade).join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate bookId if provided
    if (body.bookId) {
      const book = await prisma.hadithBook.findUnique({
        where: { id: body.bookId },
      });

      if (!book) {
        return NextResponse.json(
          { success: false, error: 'Book not found' },
          { status: 404 }
        );
      }
    }

    // Update the hadith
    const hadith = await prisma.hadith.update({
      where: { id },
      data: {
        hadithNumber: body.hadithNumber,
        arabicText: body.arabicText,
        englishText: body.englishText,
        primaryNarrator: body.primaryNarrator,
        narratorChain: body.narratorChain,
        grade: body.grade,
        gradedBy: body.gradedBy,
        bookId: body.bookId,
        chapterTitle: body.chapterTitle,
        reference: body.reference,
        inBookReference: body.inBookReference,
      },
      include: {
        book: {
          include: {
            collection: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: hadith });
  } catch (error) {
    console.error('Error updating hadith:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update hadith' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/hadiths/[id]
 * Deletes a hadith by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Check if hadith exists
    const existingHadith = await prisma.hadith.findUnique({
      where: { id },
    });

    if (!existingHadith) {
      return NextResponse.json(
        { success: false, error: 'Hadith not found' },
        { status: 404 }
      );
    }

    // Delete the hadith
    await prisma.hadith.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Hadith deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting hadith:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete hadith' },
      { status: 500 }
    );
  }
}
