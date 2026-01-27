/**
 * Public API Route: Get Hadith Collections
 * 
 * GET /api/hadiths/collections - List all hadith collections for public use
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/hadiths/collections
 * Returns all hadith collections for public display
 */
export async function GET() {
  try {
    const collections = await prisma.hadithCollection.findMany({
      select: {
        id: true,
        name: true,
        nameArabic: true,
        slug: true,
        author: true,
        authorArabic: true,
        description: true,
        totalHadiths: true,
        order: true,
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: collections,
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}
