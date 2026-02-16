/**
 * API Route: Admin Hadiths Import
 * 
 * POST /api/admin/hadiths/import
 * 
 * Imports hadiths from hadithapi.com to database.
 * Note: With the live API integration, this is primarily for
 * caching purposes or offline backup.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCollectionHadiths, isHadithAPICollection } from "@/backend/services/hadith-api";

// Collection mapping for display
const COLLECTION_MAP: Record<string, { name: string; nameArabic: string; compiler: string }> = {
  bukhari: { name: "Sahih al-Bukhari", nameArabic: "صحيح البخاري", compiler: "Imam al-Bukhari" },
  muslim: { name: "Sahih Muslim", nameArabic: "صحيح مسلم", compiler: "Imam Muslim" },
  tirmidhi: { name: "Jami at-Tirmidhi", nameArabic: "جامع الترمذي", compiler: "Imam at-Tirmidhi" },
  abudawud: { name: "Sunan Abu Dawud", nameArabic: "سنن أبي داود", compiler: "Imam Abu Dawud" },
  nasai: { name: "Sunan an-Nasa'i", nameArabic: "سنن النسائي", compiler: "Imam an-Nasa'i" },
  ibnmajah: { name: "Sunan Ibn Majah", nameArabic: "سنن ابن ماجه", compiler: "Imam Ibn Majah" },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collectionId } = body;

    if (!collectionId) {
      return NextResponse.json(
        { success: false, error: "Collection ID is required" },
        { status: 400 }
      );
    }

    if (!isHadithAPICollection(collectionId)) {
      return NextResponse.json(
        { success: false, error: "Invalid or unsupported collection ID" },
        { status: 400 }
      );
    }

    const collectionInfo = COLLECTION_MAP[collectionId];
    if (!collectionInfo) {
      return NextResponse.json(
        { success: false, error: "Unknown collection" },
        { status: 400 }
      );
    }

    // Fetch sample from hadithapi.com to verify connectivity
    console.log(`Verifying API access for ${collectionId}...`);
    const result = await getCollectionHadiths(collectionId, { page: 1, limit: 10 });

    if (result.hadiths.length === 0) {
      return NextResponse.json(
        { success: false, error: "Could not fetch hadiths from API" },
        { status: 503 }
      );
    }

    // Note: With live API, we don't need to import to database
    // The API serves data directly. This endpoint can be used
    // for database caching if needed in the future.

    return NextResponse.json({
      success: true,
      data: {
        collection: collectionId,
        collectionName: collectionInfo.name,
        total: result.total,
        sampleFetched: result.hadiths.length,
        message: `API connection verified. ${collectionInfo.name} has ${result.total} hadiths available via hadithapi.com`,
      },
    });
  } catch (error) {
    console.error("Error verifying hadith API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to connect to hadith API" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available collections
  return NextResponse.json({
    success: true,
    data: Object.entries(COLLECTION_MAP)
      .filter(([id]) => isHadithAPICollection(id))
      .map(([id, info]) => ({
        id,
        ...info,
      })),
  });
}
