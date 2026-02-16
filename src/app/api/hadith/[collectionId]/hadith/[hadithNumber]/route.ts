/**
 * API Route: GET /api/hadith/[collectionId]/hadith/[hadithNumber]
 * 
 * Returns a specific hadith by number from hadithapi.com.
 */

import { NextRequest, NextResponse } from "next/server";
import { getHadith, isHadithAPICollection } from "@/backend/services/hadith-api";

interface RouteParams {
  params: Promise<{ collectionId: string; hadithNumber: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { collectionId, hadithNumber } = await params;
    
    if (!collectionId || !hadithNumber) {
      return NextResponse.json(
        { success: false, error: "Collection ID and hadith number are required" },
        { status: 400 }
      );
    }

    // Validate collection
    if (!isHadithAPICollection(collectionId)) {
      return NextResponse.json(
        { success: false, error: "Invalid or unsupported collection" },
        { status: 400 }
      );
    }

    const hadithNum = parseInt(hadithNumber, 10);
    if (isNaN(hadithNum) || hadithNum < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid hadith number" },
        { status: 400 }
      );
    }

    const hadith = await getHadith(collectionId, hadithNum);

    if (!hadith) {
      return NextResponse.json(
        { success: false, error: "Hadith not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: hadith,
      collection: collectionId,
    });
  } catch (error) {
    console.error("Error fetching hadith:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hadith" },
      { status: 500 }
    );
  }
}
