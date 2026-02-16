/**
 * API Route: GET /api/hadith/[collectionId]/hadiths
 * 
 * Returns all hadiths from a collection with pagination.
 * Uses hadithapi.com as the data source.
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Number of hadiths per page (default: 25)
 * - status: Filter by grade - Sahih, Hasan, or Da`eef (optional)
 */

import { NextRequest, NextResponse } from "next/server";
import { getCollectionHadiths, isHadithAPICollection } from "@/backend/services/hadith-api";

interface RouteParams {
  params: Promise<{ collectionId: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { collectionId } = await params;
    
    if (!collectionId) {
      return NextResponse.json(
        { success: false, error: "Collection ID is required" },
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const status = searchParams.get("status") as "Sahih" | "Hasan" | "Da`eef" | null;

    const result = await getCollectionHadiths(collectionId, {
      page,
      limit,
      status: status || undefined,
    });

    return NextResponse.json({
      success: true,
      data: result.hadiths,
      pagination: {
        page: result.currentPage,
        limit: result.limit,
        total: result.total,
        lastPage: result.lastPage,
        hasMore: result.hasMore,
      },
      collection: collectionId,
    });
  } catch (error) {
    console.error("Error fetching hadiths:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hadiths" },
      { status: 500 }
    );
  }
}
