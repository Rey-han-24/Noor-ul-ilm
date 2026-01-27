/**
 * API Route: GET /api/hadith/[collectionId]/[bookNumber]
 * 
 * Returns hadiths from a specific book in a collection.
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Number of hadiths per page (default: 50)
 */

import { NextRequest, NextResponse } from "next/server";
import { getBookHadiths } from "@/lib/hadith-api";

interface RouteParams {
  params: Promise<{ collectionId: string; bookNumber: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { collectionId, bookNumber } = await params;
    
    if (!collectionId || !bookNumber) {
      return NextResponse.json(
        { success: false, error: "Collection ID and book number are required" },
        { status: 400 }
      );
    }

    const bookNum = parseInt(bookNumber, 10);
    if (isNaN(bookNum)) {
      return NextResponse.json(
        { success: false, error: "Invalid book number" },
        { status: 400 }
      );
    }

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await getBookHadiths(collectionId, bookNum, page, limit);
    
    return NextResponse.json({
      success: true,
      data: result.hadiths,
      pagination: {
        page,
        limit,
        total: result.total,
        hasMore: result.hasMore,
      },
      collection: collectionId,
      book: bookNum,
    });
  } catch (error) {
    console.error("Error fetching hadiths:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hadiths" },
      { status: 500 }
    );
  }
}
