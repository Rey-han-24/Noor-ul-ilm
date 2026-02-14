/**
 * Tafsir API Route
 * 
 * Fetches Quran commentary (tafsir) for a specific ayah.
 * 
 * GET /api/quran/tafsir?surah=1&ayah=1&tafsirId=169
 * 
 * Query Parameters:
 * - surah: Surah number (1-114) [required]
 * - ayah: Ayah number [required]
 * - tafsirId: Tafsir source ID (default: 169 = Ibn Kathir English) [optional]
 * 
 * Response:
 * - 200: { success: true, data: TafsirContent }
 * - 400: { success: false, error: "Invalid parameters" }
 * - 404: { success: false, error: "Tafsir not found" }
 * - 500: { success: false, error: "Internal server error" }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTafsirForAyah } from '@/backend/services/tafsir-api';
import { DEFAULT_TAFSIR_ID } from '@/shared/types/tafsir';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const surahStr = searchParams.get('surah');
    const ayahStr = searchParams.get('ayah');
    const tafsirIdStr = searchParams.get('tafsirId');

    // Validate required parameters
    if (!surahStr || !ayahStr) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: surah and ayah' },
        { status: 400 }
      );
    }

    const surahNumber = parseInt(surahStr, 10);
    const ayahNumber = parseInt(ayahStr, 10);
    const tafsirId = tafsirIdStr ? parseInt(tafsirIdStr, 10) : DEFAULT_TAFSIR_ID;

    // Validate surah number
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { success: false, error: 'Invalid surah number. Must be between 1 and 114.' },
        { status: 400 }
      );
    }

    // Validate ayah number
    if (isNaN(ayahNumber) || ayahNumber < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid ayah number. Must be a positive integer.' },
        { status: 400 }
      );
    }

    // Validate tafsir ID
    if (isNaN(tafsirId) || tafsirId < 1) {
      return NextResponse.json(
        { success: false, error: 'Invalid tafsir ID.' },
        { status: 400 }
      );
    }

    // Fetch tafsir
    const tafsir = await getTafsirForAyah(surahNumber, ayahNumber, tafsirId);

    if (!tafsir) {
      return NextResponse.json(
        { success: false, error: 'Tafsir not found for the specified ayah.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: tafsir },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      }
    );
  } catch (error) {
    console.error('Tafsir API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
