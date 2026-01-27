/**
 * API Route: GET /api/hadith/[collectionId]/hadiths
 * 
 * Returns hadiths from a collection, fetched from external CDN.
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Number of hadiths per page (default: 50)
 * - section: CDN section number (default: 1)
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchHadithsFromCDN, fetchMinifiedCollection } from "@/lib/hadith-external-api";
import { getHadithsByCollectionAndBook, getAllHadithsByCollection } from "@/data/hadiths";

interface RouteParams {
  params: Promise<{ collectionId: string }>;
}

// Cache for fetched hadiths
const hadithCache: Map<string, { data: unknown; timestamp: number }> = new Map();
const CACHE_TTL = 3600000; // 1 hour

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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const useExternal = searchParams.get("external") === "true";

    let hadiths: Awaited<ReturnType<typeof fetchMinifiedCollection>> = [];

    // Check cache first
    const cacheKey = `${collectionId}-${useExternal ? 'ext' : 'local'}`;
    const cached = hadithCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      hadiths = cached.data as typeof hadiths;
    } else {
      if (useExternal) {
        // Fetch from external CDN
        hadiths = await fetchMinifiedCollection(collectionId);
      } else {
        // Use local data first
        hadiths = getAllHadithsByCollection(collectionId);
        
        // If local data is empty, try external
        if (hadiths.length === 0) {
          hadiths = await fetchMinifiedCollection(collectionId);
        }
      }
      
      // Cache the results
      if (hadiths.length > 0) {
        hadithCache.set(cacheKey, { data: hadiths, timestamp: Date.now() });
      }
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedHadiths = hadiths.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      data: paginatedHadiths,
      pagination: {
        page,
        limit,
        total: hadiths.length,
        totalPages: Math.ceil(hadiths.length / limit),
        hasMore: startIndex + limit < hadiths.length,
      },
      collection: collectionId,
      source: hadiths.length > 0 ? (useExternal ? "external" : "local") : "none",
    });
  } catch (error) {
    console.error("Error fetching hadiths:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hadiths" },
      { status: 500 }
    );
  }
}
