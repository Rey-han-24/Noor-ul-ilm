/**
 * Hadith API Service
 * 
 * Main hadith data provider that integrates with hadithapi.com.
 * Provides a clean API for fetching hadith collections, chapters, and hadiths.
 * 
 * Features:
 * - Full pagination support
 * - Grade filtering (Sahih, Hasan, Da'if)
 * - Search across collections
 * - Caching for performance
 * 
 * @module services/hadith-api
 */

import { 
  Hadith, 
  HadithBook, 
  HadithCollection,
  HADITH_COLLECTIONS 
} from "@/shared/types/hadith";

import {
  fetchAvailableBooks,
  fetchChapters,
  fetchHadiths,
  fetchHadithByNumber,
  searchHadiths as searchHadithsAPI,
  isHadithAPICollection,
  HADITH_API_BOOK_SLUGS,
} from "./hadithapi-service";

// Re-export for backward compatibility
export { isHadithAPICollection };

// ============================================
// COLLECTION DATA
// ============================================

/**
 * Get all available collections
 * Merges API data with static metadata for complete info
 */
export async function getCollections(): Promise<HadithCollection[]> {
  try {
    const apiCollections = await fetchAvailableBooks();
    
    if (apiCollections.length > 0) {
      // Merge API data with our static metadata for richer info
      return apiCollections.map((apiCol) => {
        const staticCol = HADITH_COLLECTIONS.find((c) => c.id === apiCol.id);
        if (staticCol) {
          return {
            ...staticCol,
            totalHadiths: apiCol.totalHadiths || staticCol.totalHadiths,
            totalBooks: apiCol.totalBooks || staticCol.totalBooks,
          };
        }
        return apiCol;
      });
    }
  } catch (error) {
    console.error("[HadithAPI] Error fetching collections:", error);
  }

  // Fallback to static data
  return HADITH_COLLECTIONS.filter((c) => c.id in HADITH_API_BOOK_SLUGS);
}

/**
 * Get a specific collection by ID
 */
export async function getCollection(collectionId: string): Promise<HadithCollection | null> {
  const collections = await getCollections();
  return collections.find((c) => c.id === collectionId) || null;
}

/**
 * Get collection statistics
 */
export function getCollectionStats(collectionId: string): HadithCollection | null {
  return HADITH_COLLECTIONS.find((c) => c.id === collectionId) || null;
}

// ============================================
// BOOKS/CHAPTERS
// ============================================

/**
 * Get all books (chapters) in a collection
 */
export async function getCollectionBooks(collectionId: string): Promise<HadithBook[]> {
  if (!isHadithAPICollection(collectionId)) {
    console.warn(`[HadithAPI] Collection not supported: ${collectionId}`);
    return [];
  }

  try {
    const chapters = await fetchChapters(collectionId);
    if (chapters.length > 0) {
      return chapters;
    }
  } catch (error) {
    console.error(`[HadithAPI] Error fetching chapters for ${collectionId}:`, error);
  }

  return [];
}

// ============================================
// HADITHS
// ============================================

/**
 * Pagination options for hadith queries
 */
export interface HadithQueryOptions {
  page?: number;
  limit?: number;
  status?: "Sahih" | "Hasan" | "Da`eef";
}

/**
 * Paginated hadith result
 */
export interface PaginatedHadithResult {
  hadiths: Hadith[];
  total: number;
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
  limit: number;
}

/**
 * Get hadiths from a specific book/chapter with pagination
 */
export async function getBookHadiths(
  collectionId: string, 
  bookNumber: number,
  options: HadithQueryOptions = {}
): Promise<PaginatedHadithResult> {
  const { page = 1, limit = 25, status } = options;

  if (!isHadithAPICollection(collectionId)) {
    return {
      hadiths: [],
      total: 0,
      currentPage: 1,
      lastPage: 1,
      hasMore: false,
      limit,
    };
  }

  try {
    const result = await fetchHadiths(collectionId, {
      chapter: bookNumber,
      page,
      limit,
      status,
    });

    return {
      ...result,
      limit,
    };
  } catch (error) {
    console.error(`[HadithAPI] Error fetching hadiths for ${collectionId}/${bookNumber}:`, error);
    return {
      hadiths: [],
      total: 0,
      currentPage: 1,
      lastPage: 1,
      hasMore: false,
      limit,
    };
  }
}

/**
 * Get all hadiths from a collection with pagination
 */
export async function getCollectionHadiths(
  collectionId: string,
  options: HadithQueryOptions = {}
): Promise<PaginatedHadithResult> {
  const { page = 1, limit = 25, status } = options;

  if (!isHadithAPICollection(collectionId)) {
    return {
      hadiths: [],
      total: 0,
      currentPage: 1,
      lastPage: 1,
      hasMore: false,
      limit,
    };
  }

  try {
    const result = await fetchHadiths(collectionId, {
      page,
      limit,
      status,
    });

    return {
      ...result,
      limit,
    };
  } catch (error) {
    console.error(`[HadithAPI] Error fetching collection hadiths:`, error);
    return {
      hadiths: [],
      total: 0,
      currentPage: 1,
      lastPage: 1,
      hasMore: false,
      limit,
    };
  }
}

/**
 * Get a specific hadith by number
 */
export async function getHadith(
  collectionId: string,
  hadithNumber: number
): Promise<Hadith | null> {
  if (!isHadithAPICollection(collectionId)) {
    return null;
  }

  try {
    return await fetchHadithByNumber(collectionId, hadithNumber);
  } catch (error) {
    console.error(`[HadithAPI] Error fetching hadith ${hadithNumber}:`, error);
    return null;
  }
}

// ============================================
// SEARCH
// ============================================

/**
 * Search options
 */
export interface SearchOptions {
  collectionId?: string;
  page?: number;
  limit?: number;
}

/**
 * Search hadiths across collections
 */
export async function searchHadiths(
  query: string,
  options: SearchOptions = {}
): Promise<PaginatedHadithResult> {
  const { collectionId, page = 1, limit = 20 } = options;

  if (!query.trim()) {
    return {
      hadiths: [],
      total: 0,
      currentPage: 1,
      lastPage: 1,
      hasMore: false,
      limit,
    };
  }

  try {
    const result = await searchHadithsAPI(query, {
      collectionId,
      page,
      limit,
    });

    return {
      ...result,
      limit,
    };
  } catch (error) {
    console.error("[HadithAPI] Search error:", error);
    return {
      hadiths: [],
      total: 0,
      currentPage: 1,
      lastPage: 1,
      hasMore: false,
      limit,
    };
  }
}

// ============================================
// UTILITIES
// ============================================

/**
 * Format hadith reference for display
 */
export function formatHadithReference(collectionId: string, hadithNumber: number): string {
  const collection = HADITH_COLLECTIONS.find((c) => c.id === collectionId);
  if (!collection) return `Hadith ${hadithNumber}`;
  
  return `${collection.name} ${hadithNumber}`;
}

/**
 * Get supported collection IDs
 */
export function getSupportedCollections(): string[] {
  return Object.keys(HADITH_API_BOOK_SLUGS);
}
