/**
 * API Route: GET /api/hadith/search
 * 
 * Search hadiths across all collections.
 * 
 * Query Parameters:
 * - q: Search query (required)
 * - collection: Filter by collection ID (optional)
 * - limit: Max results (default: 50)
 */

import { NextRequest, NextResponse } from "next/server";
import { searchAllHadiths } from "@/data/hadiths";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const collection = searchParams.get("collection");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    let results = searchAllHadiths(query);

    // Filter by collection if specified
    if (collection) {
      results = results.filter(h => 
        h.reference?.toLowerCase().includes(collection.toLowerCase())
      );
    }

    // Limit results
    results = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: results,
      query,
      total: results.length,
    });
  } catch (error) {
    console.error("Error searching hadiths:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search hadiths" },
      { status: 500 }
    );
  }
}
