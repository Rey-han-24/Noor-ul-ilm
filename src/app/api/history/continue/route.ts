/**
 * Continue Reading API Route
 * 
 * Returns the user's most recent reading positions for quick resume
 * 
 * @module api/history/continue
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getCurrentUser } from '@/backend/lib/auth-server';
import type { ReadingHistory } from '@prisma/client';

// Surah names for display (abbreviated list, you'd have full 114)
const SURAH_NAMES: Record<number, { arabic: string; english: string; transliteration: string }> = {
  1: { arabic: 'الفاتحة', english: 'The Opening', transliteration: 'Al-Fatihah' },
  2: { arabic: 'البقرة', english: 'The Cow', transliteration: 'Al-Baqarah' },
  3: { arabic: 'آل عمران', english: 'The Family of Imran', transliteration: 'Ali Imran' },
  4: { arabic: 'النساء', english: 'The Women', transliteration: 'An-Nisa' },
  5: { arabic: 'المائدة', english: 'The Table Spread', transliteration: 'Al-Ma\'idah' },
  // ... continues for all 114 surahs
};

// Hadith collection names
const COLLECTION_NAMES: Record<string, string> = {
  'bukhari': 'Sahih al-Bukhari',
  'muslim': 'Sahih Muslim',
  'abudawud': 'Sunan Abu Dawud',
  'tirmidhi': 'Jami at-Tirmidhi',
  'nasai': 'Sunan an-Nasai',
  'ibnmajah': 'Sunan Ibn Majah',
  'malik': 'Muwatta Malik',
  'ahmad': 'Musnad Ahmad',
};

/**
 * GET handler - Returns recent reading positions for continue reading feature
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to view continue reading.' },
        { status: 401 }
      );
    }

    // Get most recent Quran reading position
    const lastQuranRead = await prisma.readingHistory.findFirst({
      where: {
        userId: user.id,
        type: 'QURAN',
      },
      orderBy: { lastReadAt: 'desc' },
    });

    // Get most recent Hadith reading position
    const lastHadithRead = await prisma.readingHistory.findFirst({
      where: {
        userId: user.id,
        type: 'HADITH',
      },
      orderBy: { lastReadAt: 'desc' },
    });

    // Get 5 most recent entries overall
    const recentHistory = await prisma.readingHistory.findMany({
      where: { userId: user.id },
      orderBy: { lastReadAt: 'desc' },
      take: 5,
    });

    // Format continue reading data
    const continueReading = {
      quran: lastQuranRead ? {
        surahNumber: lastQuranRead.surahNumber,
        ayahNumber: lastQuranRead.ayahNumber,
        surahName: lastQuranRead.surahNumber ? SURAH_NAMES[lastQuranRead.surahNumber] : null,
        progress: lastQuranRead.progress,
        lastReadAt: lastQuranRead.lastReadAt,
        url: `/quran/${lastQuranRead.surahNumber}${lastQuranRead.ayahNumber ? `#ayah-${lastQuranRead.ayahNumber}` : ''}`,
      } : null,
      hadith: lastHadithRead ? {
        collectionId: lastHadithRead.collectionId,
        bookNumber: lastHadithRead.bookNumber,
        hadithNumber: lastHadithRead.hadithNumber,
        collectionName: lastHadithRead.collectionId ? COLLECTION_NAMES[lastHadithRead.collectionId] : null,
        progress: lastHadithRead.progress,
        lastReadAt: lastHadithRead.lastReadAt,
        url: `/hadith/${lastHadithRead.collectionId}/${lastHadithRead.hadithNumber}`,
      } : null,
      recentActivity: recentHistory.map((entry: ReadingHistory) => ({
        id: entry.id,
        type: entry.type,
        title: entry.type === 'QURAN'
          ? `Surah ${entry.surahNumber}${entry.ayahNumber ? `:${entry.ayahNumber}` : ''}`
          : `${COLLECTION_NAMES[entry.collectionId || ''] || entry.collectionId} #${entry.hadithNumber}`,
        url: entry.type === 'QURAN'
          ? `/quran/${entry.surahNumber}`
          : `/hadith/${entry.collectionId}/${entry.hadithNumber}`,
        progress: entry.progress,
        lastReadAt: entry.lastReadAt,
      })),
    };

    return NextResponse.json({
      success: true,
      data: continueReading,
    });

  } catch (error) {
    console.error('[Continue Reading GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch continue reading data. Please try again.' },
      { status: 500 }
    );
  }
}
