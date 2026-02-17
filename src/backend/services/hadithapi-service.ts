/**
 * HadithAPI.com Service
 * 
 * Official hadith data provider using hadithapi.com API.
 * Provides access to authenticated hadith collections with proper grading.
 * 
 * API Documentation: https://hadithapi.com/
 * 
 * Endpoints:
 *   /api/books                        — List all hadith books/collections
 *   /api/{bookSlug}/chapters          — List chapters in a book
 *   /api/hadiths                      — Search/list hadiths with filters
 * 
 * @module services/hadithapi-service
 */

import { Hadith, HadithGrade, HadithBook, HadithCollection } from "@/shared/types/hadith";

// ============================================
// CONFIGURATION
// ============================================

/** HadithAPI.com base URL */
const API_BASE_URL = "https://hadithapi.com/api";

/** 
 * HadithAPI.com API Key
 * Note: Due to special characters ($) in the API key, we store it directly here.
 * In production, consider using a secrets manager or properly encoded env var.
 */
const HADITH_API_KEY = "$2y$10$UFUEwfUyf3EYVlibXgsk9eo0wXxW5LKg3hBeiftCaCI5Y1R2QVUS";

/** API Key getter */
const getApiKey = (): string => {
  // Use hardcoded key since env vars have issues with $ characters
  return HADITH_API_KEY;
};

/**
 * Book slug mapping from our internal IDs to hadithapi.com slugs
 */
export const HADITH_API_BOOK_SLUGS: Record<string, string> = {
  bukhari: "sahih-bukhari",
  muslim: "sahih-muslim",
  tirmidhi: "al-tirmidhi",
  abudawud: "abu-dawood",
  nasai: "sunan-nasai",
  ibnmajah: "ibn-e-majah",
  mishkat: "mishkat",
  ahmad: "musnad-ahmad",
};

/**
 * Reverse mapping from API slugs to our internal IDs
 */
const SLUG_TO_INTERNAL_ID: Record<string, string> = {
  "sahih-bukhari": "bukhari",
  "sahih-muslim": "muslim",
  "al-tirmidhi": "tirmidhi",
  "abu-dawood": "abudawud",
  "sunan-nasai": "nasai",
  "ibn-e-majah": "ibnmajah",
  "mishkat": "mishkat",
  "musnad-ahmad": "ahmad",
};

/** Collection display info */
const COLLECTION_INFO: Record<string, { name: string; nameArabic: string; compiler: string }> = {
  bukhari: { name: "Sahih al-Bukhari", nameArabic: "صحيح البخاري", compiler: "Imam Bukhari" },
  muslim: { name: "Sahih Muslim", nameArabic: "صحيح مسلم", compiler: "Imam Muslim" },
  tirmidhi: { name: "Jami' al-Tirmidhi", nameArabic: "جامع الترمذي", compiler: "Imam Tirmidhi" },
  abudawud: { name: "Sunan Abu Dawud", nameArabic: "سنن أبي داود", compiler: "Imam Abu Dawud" },
  nasai: { name: "Sunan an-Nasa'i", nameArabic: "سنن النسائي", compiler: "Imam Nasa'i" },
  ibnmajah: { name: "Sunan Ibn Majah", nameArabic: "سنن ابن ماجه", compiler: "Imam Ibn Majah" },
  mishkat: { name: "Mishkat al-Masabih", nameArabic: "مشكاة المصابيح", compiler: "Al-Khatib al-Tabrizi" },
  ahmad: { name: "Musnad Ahmad", nameArabic: "مسند أحمد", compiler: "Imam Ahmad ibn Hanbal" },
};

// ============================================
// CACHING LAYER
// ============================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/** In-memory cache */
const cache = new Map<string, CacheEntry<unknown>>();

/** Cache TTL: 1 hour for hadith data */
const CACHE_TTL = 3600000;
/** Cache TTL: 6 hours for chapters/books metadata */
const METADATA_CACHE_TTL = 21600000;

/**
 * Get cached data if still valid
 */
function getCached<T>(key: string, ttl: number = CACHE_TTL): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < ttl) {
    return entry.data as T;
  }
  return null;
}

/**
 * Set cache entry
 */
function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Clear expired cache entries (call periodically)
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > METADATA_CACHE_TTL) {
      cache.delete(key);
    }
  }
}

// ============================================
// API RESPONSE TYPES (from hadithapi.com)
// ============================================

interface APIBook {
  id: number;
  bookName: string;
  writerName: string;
  aboutWriter: string | null;
  writerDeath: string;
  bookSlug: string;
  hadiths_count: string;
  chapters_count: string;
}

interface APIChapter {
  id: number;
  chapterNumber: string;
  chapterEnglish: string;
  chapterUrdu: string;
  chapterArabic: string;
  bookSlug: string;
}

interface APIHadith {
  id: number;
  hadithNumber: string;
  englishNarrator: string;
  hadithEnglish: string;
  hadithUrdu: string;
  hadithArabic: string;
  headingArabic: string;
  headingUrdu: string;
  headingEnglish: string;
  chapterId: string;
  bookSlug: string;
  volume: string;
  status: string;
  book: {
    id: number;
    bookName: string;
    writerName: string;
    bookSlug: string;
  };
  chapter: {
    id: number;
    chapterNumber: string;
    chapterEnglish: string;
    chapterUrdu: string;
    chapterArabic: string;
  };
}

interface APIResponse<T> {
  status: number;
  message: string;
  [key: string]: T | number | string;
}

interface APIPaginatedResponse<T> {
  status: number;
  message: string;
  hadiths?: {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  chapters?: {
    current_page: number;
    data: T[];
    last_page: number;
    total: number;
  };
}

// ============================================
// API FETCH HELPERS
// ============================================

/**
 * Fetch from hadithapi.com with proper error handling
 */
async function fetchAPI<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("[HadithAPI] API key not configured");
    return null;
  }

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.set("apiKey", apiKey);
  
  // Add additional params
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error("[HadithAPI] Invalid API key");
      } else if (response.status === 403) {
        console.error("[HadithAPI] API key required");
      } else if (response.status === 404) {
        console.error("[HadithAPI] Resource not found:", endpoint);
      } else {
        console.error("[HadithAPI] API error:", response.status, response.statusText);
      }
      return null;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("[HadithAPI] Fetch error:", error);
    return null;
  }
}

// ============================================
// PUBLIC API FUNCTIONS
// ============================================

/**
 * Check if a collection is supported by hadithapi.com
 */
export function isHadithAPICollection(collectionId: string): boolean {
  return collectionId in HADITH_API_BOOK_SLUGS;
}

/**
 * Get API slug for a collection
 */
export function getAPISlug(collectionId: string): string | null {
  return HADITH_API_BOOK_SLUGS[collectionId] || null;
}

/**
 * Fetch all available books/collections from hadithapi.com
 */
export async function fetchAvailableBooks(): Promise<HadithCollection[]> {
  const cacheKey = "hadithapi:books";
  const cached = getCached<HadithCollection[]>(cacheKey, METADATA_CACHE_TTL);
  if (cached) return cached;

  const response = await fetchAPI<APIResponse<APIBook[]>>("/books");
  if (!response || !Array.isArray(response.books)) {
    return [];
  }

  const collections: HadithCollection[] = (response.books as APIBook[]).map((book) => {
    const internalId = SLUG_TO_INTERNAL_ID[book.bookSlug] || book.bookSlug;
    const info = COLLECTION_INFO[internalId] || {
      name: book.bookName,
      nameArabic: "",
      compiler: book.writerName,
    };

    return {
      id: internalId,
      name: info.name,
      nameArabic: info.nameArabic,
      compilerName: info.compiler,
      compilerNameArabic: "",
      totalHadiths: parseInt(book.hadiths_count, 10) || 0,
      totalBooks: parseInt(book.chapters_count, 10) || 0,
      description: book.aboutWriter || `Compiled by ${book.writerName}`,
      compilerDeathYear: parseInt(book.writerDeath, 10) || 0,
    };
  });

  setCache(cacheKey, collections);
  return collections;
}

/**
 * Fetch chapters (books) for a collection
 */
export async function fetchChapters(collectionId: string): Promise<HadithBook[]> {
  const slug = getAPISlug(collectionId);
  if (!slug) {
    console.warn(`[HadithAPI] Unknown collection: ${collectionId}`);
    return [];
  }

  const cacheKey = `hadithapi:chapters:${collectionId}`;
  const cached = getCached<HadithBook[]>(cacheKey, METADATA_CACHE_TTL);
  if (cached) return cached;

  // Fetch all chapters with pagination
  const allChapters: APIChapter[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchAPI<APIPaginatedResponse<APIChapter>>(
      `/${slug}/chapters`,
      { paginate: "100", page: page.toString() }
    );

    if (!response || !response.chapters?.data) {
      break;
    }

    allChapters.push(...response.chapters.data);
    
    if (page >= (response.chapters.last_page || 1)) {
      hasMore = false;
    } else {
      page++;
    }
  }

  const books: HadithBook[] = allChapters.map((chapter) => ({
    bookNumber: parseInt(chapter.chapterNumber, 10) || 0,
    name: chapter.chapterEnglish || `Chapter ${chapter.chapterNumber}`,
    nameArabic: chapter.chapterArabic || "",
    hadithCount: 0, // Will be filled when fetching hadiths
    hadithStartNumber: 0,
    hadithEndNumber: 0,
  }));

  setCache(cacheKey, books);
  return books;
}

/**
 * Map API status to HadithGrade
 */
function mapGrade(status: string): HadithGrade {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("sahih")) return "Sahih";
  if (statusLower.includes("hasan")) return "Hasan";
  if (statusLower.includes("da") || statusLower.includes("weak")) return "Da'if";
  if (statusLower.includes("mawdu") || statusLower.includes("fabricat")) return "Mawdu";
  return "Unknown";
}

/**
 * Transform API hadith to our Hadith type
 */
function transformHadith(apiHadith: APIHadith, collectionId: string): Hadith {
  const hadithNum = parseInt(apiHadith.hadithNumber, 10) || 0;
  const chapterNum = parseInt(apiHadith.chapter?.chapterNumber || apiHadith.chapterId, 10) || 0;
  const info = COLLECTION_INFO[collectionId];

  return {
    hadithNumber: hadithNum,
    arabicText: apiHadith.hadithArabic || "",
    englishText: apiHadith.hadithEnglish || "",
    primaryNarrator: apiHadith.englishNarrator || "",
    primaryNarratorArabic: "",
    grade: mapGrade(apiHadith.status),
    gradedBy: "Hadith Scholars",
    bookNumber: chapterNum,
    chapterNumber: chapterNum,
    chapterTitle: apiHadith.chapter?.chapterEnglish || apiHadith.headingEnglish || "",
    chapterTitleArabic: apiHadith.chapter?.chapterArabic || apiHadith.headingArabic || "",
    reference: `${info?.name || collectionId} ${hadithNum}`,
    inBookReference: `Book ${chapterNum}, Hadith ${hadithNum}`,
  };
}

/**
 * Fetch hadiths with pagination
 */
export async function fetchHadiths(
  collectionId: string,
  options: {
    chapter?: number;
    page?: number;
    limit?: number;
    status?: "Sahih" | "Hasan" | "Da`eef";
  } = {}
): Promise<{
  hadiths: Hadith[];
  total: number;
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
}> {
  const slug = getAPISlug(collectionId);
  if (!slug) {
    return { hadiths: [], total: 0, currentPage: 1, lastPage: 1, hasMore: false };
  }

  const { chapter, page = 1, limit = 25, status } = options;

  // Build cache key
  const cacheKey = `hadithapi:hadiths:${collectionId}:ch${chapter || "all"}:p${page}:l${limit}:s${status || "all"}`;
  const cached = getCached<{
    hadiths: Hadith[];
    total: number;
    currentPage: number;
    lastPage: number;
    hasMore: boolean;
  }>(cacheKey);
  if (cached) return cached;

  // Build params
  const params: Record<string, string> = {
    book: slug,
    paginate: limit.toString(),
    page: page.toString(),
  };
  
  if (chapter) {
    params.chapter = chapter.toString();
  }
  
  if (status) {
    params.status = status;
  }

  const response = await fetchAPI<APIPaginatedResponse<APIHadith>>("/hadiths", params);

  if (!response || !response.hadiths?.data) {
    return { hadiths: [], total: 0, currentPage: 1, lastPage: 1, hasMore: false };
  }

  const hadiths = response.hadiths.data.map((h) => transformHadith(h, collectionId));
  
  const result = {
    hadiths,
    total: response.hadiths.total,
    currentPage: response.hadiths.current_page,
    lastPage: response.hadiths.last_page,
    hasMore: response.hadiths.next_page_url !== null,
  };

  setCache(cacheKey, result);
  return result;
}

/**
 * Fetch a single hadith by number
 */
export async function fetchHadithByNumber(
  collectionId: string,
  hadithNumber: number
): Promise<Hadith | null> {
  const slug = getAPISlug(collectionId);
  if (!slug) return null;

  const cacheKey = `hadithapi:hadith:${collectionId}:${hadithNumber}`;
  const cached = getCached<Hadith>(cacheKey);
  if (cached) return cached;

  const response = await fetchAPI<APIPaginatedResponse<APIHadith>>("/hadiths", {
    book: slug,
    hadithNumber: hadithNumber.toString(),
  });

  if (!response || !response.hadiths?.data?.[0]) {
    return null;
  }

  const hadith = transformHadith(response.hadiths.data[0], collectionId);
  setCache(cacheKey, hadith);
  return hadith;
}

/**
 * Search hadiths across collections
 */
export async function searchHadiths(
  query: string,
  options: {
    collectionId?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<{
  hadiths: Hadith[];
  total: number;
  currentPage: number;
  lastPage: number;
  hasMore: boolean;
}> {
  const { collectionId, page = 1, limit = 20 } = options;

  const params: Record<string, string> = {
    hadithEnglish: query,
    paginate: limit.toString(),
    page: page.toString(),
  };

  if (collectionId) {
    const slug = getAPISlug(collectionId);
    if (slug) {
      params.book = slug;
    }
  }

  const response = await fetchAPI<APIPaginatedResponse<APIHadith>>("/hadiths", params);

  if (!response || !response.hadiths?.data) {
    return { hadiths: [], total: 0, currentPage: 1, lastPage: 1, hasMore: false };
  }

  const hadiths = response.hadiths.data.map((h) => {
    const internalId = SLUG_TO_INTERNAL_ID[h.bookSlug] || h.bookSlug;
    return transformHadith(h, internalId);
  });

  return {
    hadiths,
    total: response.hadiths.total,
    currentPage: response.hadiths.current_page,
    lastPage: response.hadiths.last_page,
    hasMore: response.hadiths.next_page_url !== null,
  };
}
