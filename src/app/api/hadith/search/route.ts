/**
 * API Route: GET /api/hadith/search
 * 
 * Search hadiths across all collections using hadithapi.com.
 * 
 * Query Parameters:
 * - q: Search query (required)
 * - collection: Filter by collection ID (optional)
 * - page: Page number (default: 1)
 * - limit: Max results per page (default: 20)
 */

import { NextRequest, NextResponse } from "next/server";
import { searchHadiths } from "@/backend/services/hadith-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const collection = searchParams.get("collection") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const result = await searchHadiths(query, {
      collectionId: collection,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.hadiths,
      query,
      pagination: {
        page: result.currentPage,
        limit: result.limit,
        total: result.total,
        lastPage: result.lastPage,
        hasMore: result.hasMore,
      },
    });
  } catch (error) {
    console.error("Error searching hadiths:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search hadiths" },
      { status: 500 }
    );
  }
}
