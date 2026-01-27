/**
 * API Route: GET /api/hadith/[collectionId]/hadith/[hadithNumber]
 * 
 * Returns a specific hadith by number.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchHadithByNumber } from "@/lib/hadith-external-api";
import { getHadith } from "@/lib/hadith-api";

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

    const hadithNum = parseInt(hadithNumber, 10);
    if (isNaN(hadithNum)) {
      return NextResponse.json(
        { success: false, error: "Invalid hadith number" },
        { status: 400 }
      );
    }

    // Try local data first
    let hadith = await getHadith(collectionId, hadithNum);
    
    // If not found locally, try external
    if (!hadith) {
      hadith = await fetchHadithByNumber(collectionId, hadithNum);
    }

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
