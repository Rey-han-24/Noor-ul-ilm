/**
 * API Route: GET /api/hadith/[collectionId]/books
 * 
 * Returns list of books in a hadith collection.
 */

import { NextRequest, NextResponse } from "next/server";
import { getCollectionBooks } from "@/backend/services/hadith-api";

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

    const books = await getCollectionBooks(collectionId);
    
    return NextResponse.json({
      success: true,
      data: books,
      collection: collectionId,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
