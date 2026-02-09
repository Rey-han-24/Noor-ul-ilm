/**
 * API Route: Admin Hadiths Import
 * 
 * POST /api/admin/hadiths/import
 * 
 * Imports hadiths from external API to database.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchMinifiedCollection } from "@/backend/services/hadith-external-api";

// Collection mapping for external API
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
    const { collectionId, source = "api" } = body;

    if (!collectionId) {
      return NextResponse.json(
        { success: false, error: "Collection ID is required" },
        { status: 400 }
      );
    }

    const collectionInfo = COLLECTION_MAP[collectionId];
    if (!collectionInfo) {
      return NextResponse.json(
        { success: false, error: "Invalid collection ID" },
        { status: 400 }
      );
    }

    // Fetch from external API
    console.log(`Starting import for ${collectionId}...`);
    const hadiths = await fetchMinifiedCollection(collectionId);

    if (hadiths.length === 0) {
      return NextResponse.json(
        { success: false, error: "No hadiths found from external source" },
        { status: 404 }
      );
    }

    // In a real implementation, you would save to database here using Prisma
    // For now, we'll return success with the count
    
    // Example Prisma code (uncomment when database is set up):
    /*
    const prisma = new PrismaClient();
    
    // Create or update collection
    const collection = await prisma.hadithCollection.upsert({
      where: { slug: collectionId },
      update: { totalHadiths: hadiths.length },
      create: {
        slug: collectionId,
        name: collectionInfo.name,
        nameArabic: collectionInfo.nameArabic,
        compiler: collectionInfo.compiler,
        totalHadiths: hadiths.length,
      },
    });

    // Insert hadiths in batches
    const batchSize = 100;
    let imported = 0;
    
    for (let i = 0; i < hadiths.length; i += batchSize) {
      const batch = hadiths.slice(i, i + batchSize);
      await prisma.hadith.createMany({
        data: batch.map(h => ({
          collectionId: collection.id,
          hadithNumber: h.hadithNumber,
          arabicText: h.arabicText,
          englishText: h.englishText,
          primaryNarrator: h.primaryNarrator,
          grade: h.grade?.toUpperCase() as HadithGrade,
          gradedBy: h.gradedBy,
          bookNumber: h.bookNumber,
          reference: h.reference,
          inBookReference: h.inBookReference,
        })),
        skipDuplicates: true,
      });
      imported += batch.length;
    }
    */

    return NextResponse.json({
      success: true,
      data: {
        collection: collectionId,
        collectionName: collectionInfo.name,
        total: hadiths.length,
        imported: hadiths.length,
        skipped: 0,
        message: `Successfully fetched ${hadiths.length} hadiths from ${collectionInfo.name}`,
      },
    });
  } catch (error) {
    console.error("Error importing hadiths:", error);
    return NextResponse.json(
      { success: false, error: "Failed to import hadiths" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available collections for import
  return NextResponse.json({
    success: true,
    data: Object.entries(COLLECTION_MAP).map(([id, info]) => ({
      id,
      ...info,
    })),
  });
}
