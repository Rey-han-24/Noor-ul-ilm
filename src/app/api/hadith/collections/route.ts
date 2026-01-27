/**
 * API Route: GET /api/hadith/collections
 * 
 * Returns list of all available hadith collections.
 */

import { NextResponse } from "next/server";
import { HADITH_COLLECTIONS } from "@/types/hadith";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: HADITH_COLLECTIONS,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}
