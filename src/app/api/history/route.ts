/**
 * Reading History API Routes
 * 
 * Tracks and retrieves user reading progress for Quran and Hadith
 * 
 * @module api/history
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getCurrentUser } from '@/backend/lib/auth-server';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const recordHistorySchema = z.object({
  type: z.enum(['QURAN', 'HADITH']),
  surahNumber: z.number().int().min(1).max(114).optional(),
  ayahNumber: z.number().int().min(1).optional(),
  collectionId: z.string().optional(),
  bookNumber: z.number().int().min(1).optional(),
  hadithNumber: z.number().int().min(1).optional(),
  progress: z.number().min(0).max(100).optional(),
}).refine(
  (data) => {
    if (data.type === 'QURAN') {
      return data.surahNumber !== undefined;
    }
    if (data.type === 'HADITH') {
      return data.collectionId !== undefined;
    }
    return false;
  },
  {
    message: 'Invalid history data. Quran requires surahNumber. Hadith requires collectionId.',
  }
);

// ============================================
// GET - Fetch Reading History
// ============================================

/**
 * Retrieves reading history for the authenticated user
 * 
 * @param request - Next.js request object
 * @returns JSON response with reading history
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to view reading history.' },
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

    // Fetch history with pagination
    const [history, total] = await Promise.all([
      prisma.readingHistory.findMany({
        where: whereClause,
        orderBy: { lastReadAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.readingHistory.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        history,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });

  } catch (error) {
    console.error('[History GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading history. Please try again.' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Record Reading Activity
// ============================================

/**
 * Records or updates reading activity for the authenticated user
 * Uses upsert to update timestamp if entry exists
 * 
 * @param request - Next.js request object with reading data
 * @returns JSON response with recorded history entry
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to record reading history.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validationResult = recordHistorySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { type, surahNumber, ayahNumber, collectionId, bookNumber, hadithNumber, progress } = validationResult.data;

    // Find existing history entry for upsert
    let existingEntry = null;
    
    if (type === 'QURAN' && surahNumber) {
      existingEntry = await prisma.readingHistory.findUnique({
        where: {
          userId_type_surahNumber: {
            userId: user.id,
            type,
            surahNumber,
          },
        },
      });
    } else if (type === 'HADITH' && collectionId) {
      existingEntry = await prisma.readingHistory.findUnique({
        where: {
          userId_type_collectionId_bookNumber: {
            userId: user.id,
            type,
            collectionId,
            bookNumber: bookNumber || 1,
          },
        },
      });
    }

    let historyEntry;

    if (existingEntry) {
      // Update existing entry
      historyEntry = await prisma.readingHistory.update({
        where: { id: existingEntry.id },
        data: {
          lastReadAt: new Date(),
          ...(ayahNumber && { ayahNumber }),
          ...(hadithNumber && { hadithNumber }),
          ...(progress !== undefined && { progress }),
        },
      });
    } else {
      // Create new entry
      historyEntry = await prisma.readingHistory.create({
        data: {
          userId: user.id,
          type,
          surahNumber: type === 'QURAN' ? surahNumber : null,
          ayahNumber: type === 'QURAN' ? ayahNumber : null,
          collectionId: type === 'HADITH' ? collectionId : null,
          bookNumber: type === 'HADITH' ? (bookNumber || 1) : null,
          hadithNumber: type === 'HADITH' ? hadithNumber : null,
          progress: progress || 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: existingEntry ? 'Reading progress updated.' : 'Reading history recorded.',
      data: historyEntry,
    }, { status: existingEntry ? 200 : 201 });

  } catch (error) {
    console.error('[History POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to record reading history. Please try again.' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Clear Reading History
// ============================================

/**
 * Clears reading history for the authenticated user
 * Can clear all history or by type
 * 
 * @param request - Next.js request object
 * @returns JSON response confirming deletion
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to clear reading history.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const historyId = searchParams.get('id');
    const type = searchParams.get('type') as 'QURAN' | 'HADITH' | null;
    const clearAll = searchParams.get('clearAll') === 'true';

    if (historyId) {
      // Delete specific entry
      const entry = await prisma.readingHistory.findUnique({
        where: { id: historyId },
      });

      if (!entry) {
        return NextResponse.json(
          { error: 'History entry not found.' },
          { status: 404 }
        );
      }

      if (entry.userId !== user.id) {
        return NextResponse.json(
          { error: 'You do not have permission to delete this entry.' },
          { status: 403 }
        );
      }

      await prisma.readingHistory.delete({
        where: { id: historyId },
      });

      return NextResponse.json({
        success: true,
        message: 'History entry deleted successfully.',
      });
    }

    if (clearAll) {
      // Clear all history (optionally filtered by type)
      const whereClause: Record<string, unknown> = {
        userId: user.id,
      };

      if (type && ['QURAN', 'HADITH'].includes(type)) {
        whereClause.type = type;
      }

      const result = await prisma.readingHistory.deleteMany({
        where: whereClause,
      });

      return NextResponse.json({
        success: true,
        message: `Cleared ${result.count} history entries.`,
        data: { deletedCount: result.count },
      });
    }

    return NextResponse.json(
      { error: 'Please provide a history ID or set clearAll=true.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('[History DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to clear reading history. Please try again.' },
      { status: 500 }
    );
  }
}
