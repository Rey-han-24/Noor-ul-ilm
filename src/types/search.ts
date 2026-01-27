/**
 * Search Types
 * 
 * Type definitions for the unified search functionality
 * across Quran and Hadith content.
 */

/**
 * Search result types
 */
export type SearchResultType = "quran" | "hadith";

/**
 * Base search result interface
 */
interface BaseSearchResult {
  /** Unique identifier for the result */
  id: string;
  /** Type of content */
  type: SearchResultType;
  /** Relevance score (higher = more relevant) */
  score: number;
  /** Matched text snippet with highlight markers */
  snippet: string;
}

/**
 * Quran search result
 */
export interface QuranSearchResult extends BaseSearchResult {
  type: "quran";
  /** Surah number (1-114) */
  surahNumber: number;
  /** Surah name in English */
  surahName: string;
  /** Surah name in Arabic */
  surahNameArabic: string;
  /** Ayah/verse number */
  ayahNumber: number;
  /** Arabic text of the verse */
  arabicText: string;
  /** English translation */
  translationText: string;
  /** Translation source */
  translationSource: string;
}

/**
 * Hadith search result
 */
export interface HadithSearchResult extends BaseSearchResult {
  type: "hadith";
  /** Collection ID (bukhari, muslim, etc.) */
  collectionId: string;
  /** Collection name */
  collectionName: string;
  /** Book number within collection */
  bookNumber: number;
  /** Hadith number */
  hadithNumber: number;
  /** Arabic text */
  arabicText: string;
  /** English translation */
  englishText: string;
  /** Hadith grade (Sahih, Hasan, etc.) */
  grade: string;
  /** Primary narrator */
  narrator?: string;
}

/**
 * Union type for all search results
 */
export type SearchResult = QuranSearchResult | HadithSearchResult;

/**
 * Search response with pagination
 */
export interface SearchResponse {
  /** Search results */
  results: SearchResult[];
  /** Total number of results */
  total: number;
  /** Current page */
  page: number;
  /** Results per page */
  limit: number;
  /** Whether there are more results */
  hasMore: boolean;
  /** Search query */
  query: string;
  /** Filter applied */
  filter: SearchFilter;
}

/**
 * Search filter options
 */
export type SearchFilter = "all" | "quran" | "hadith";

/**
 * Search query parameters
 */
export interface SearchParams {
  /** Search query string */
  query: string;
  /** Filter by content type */
  filter?: SearchFilter;
  /** Page number (1-based) */
  page?: number;
  /** Results per page */
  limit?: number;
}

/**
 * Recent search item
 */
export interface RecentSearch {
  /** Search query */
  query: string;
  /** When the search was made */
  timestamp: number;
  /** Number of results found */
  resultCount: number;
}

/**
 * Search suggestions
 */
export interface SearchSuggestion {
  /** Suggested query text */
  text: string;
  /** Type of suggestion */
  type: "recent" | "popular" | "correction";
}
