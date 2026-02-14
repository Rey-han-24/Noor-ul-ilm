/**
 * Hadith External API Service
 * 
 * Fetches hadith data from fawazahmed0/hadith-api CDN.
 * 
 * API URL Structure:
 *   https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/{endpoint}
 * 
 * Endpoints:
 *   /editions.json              — List all available editions
 *   /editions/eng-bukhari.json  — Full English Bukhari collection
 *   /editions/ara-bukhari.json  — Full Arabic Bukhari collection
 *   /editions/eng-bukhari/1035.json — Single hadith #1035
 *   /editions/eng-bukhari/sections/1.json — Section/Book 1
 *   /info.json                  — Book metadata, grades, references
 * 
 * @module services/hadith-external-api
 */

import { Hadith, HadithGrade, HadithBook } from "@/shared/types/hadith";

/** CDN base URL for hadith-api repository (version 1) */
const CDN_BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";

/** CDN collection name mapping */
const CDN_COLLECTION_MAP: Record<string, string> = {
  bukhari: "bukhari",
  muslim: "muslim",
  tirmidhi: "tirmidhi",
  abudawud: "abudawud",
  nasai: "nasai",
  ibnmajah: "ibnmajah",
  malik: "malik",
};

/** Display name for collections */
const COLLECTION_DISPLAY_NAMES: Record<string, string> = {
  bukhari: "Bukhari",
  muslim: "Muslim",
  tirmidhi: "Tirmidhi",
  abudawud: "Abu Dawud",
  nasai: "Nasai",
  ibnmajah: "Ibn Majah",
  malik: "Malik",
};

// ============================================
// CACHING LAYER
// ============================================

/** Cache entry with TTL */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/** In-memory cache for CDN responses */
const sectionCache = new Map<string, CacheEntry<Hadith[]>>();
const infoCache: { data: HadithInfoData | null; timestamp: number } = { data: null, timestamp: 0 };

/** Cache TTL: 2 hours for hadith data */
const CACHE_TTL = 7200000;
/** Cache TTL: 24 hours for info/metadata */
const INFO_CACHE_TTL = 86400000;

/**
 * Get cached data if still valid
 */
function getCached<T>(cache: Map<string, CacheEntry<T>>, key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  return null;
}


interface CDNHadith {
  hadithnumber?: number;
  text?: string;
  grades?: Array<{ name?: string; grade?: string; graded_by?: string }>;
  reference?: { book?: number; hadith?: number };
}

interface CDNSectionInfo {
  hadithnumber_first: number;
  hadithnumber_last: number;
  arabicnumber_first: number;
  arabicnumber_last: number;
}

/** Info.json structure for a collection */
interface CDNCollectionInfo {
  metadata?: {
    name?: string;
    sections?: Record<string, string>;
    section_details?: Record<string, CDNSectionInfo>;
  };
}

/** Top-level info.json structure */
type HadithInfoData = Record<string, CDNCollectionInfo>;

// ============================================
// GRADE PARSING
// ============================================

/**
 * Parse hadith grade from string
 * @param gradeText - Raw grade string from API
 * @param collectionId - Collection ID (Bukhari/Muslim default to Sahih)
 * @returns Normalized HadithGrade
 */
function parseGrade(gradeText: string | undefined, collectionId: string): HadithGrade {
  if (!gradeText) {
    // Bukhari and Muslim are considered Sahih by default
    if (collectionId === "bukhari" || collectionId === "muslim") return "Sahih";
    return "Unknown";
  }
  const lower = gradeText.toLowerCase();
  if (lower.includes("sahih")) return "Sahih";
  if (lower.includes("hasan")) return "Hasan";
  if (lower.includes("da'if") || lower.includes("daif") || lower.includes("weak")) return "Da'if";
  if (lower.includes("mawdu") || lower.includes("fabricat")) return "Mawdu";
  return "Unknown";
}

/**
 * Get default grader name for a collection
 */
function getDefaultGrader(collectionId: string): string {
  switch (collectionId) {
    case "bukhari": return "Al-Bukhari";
    case "muslim": return "Muslim";
    case "tirmidhi": return "At-Tirmidhi";
    case "abudawud": return "Abu Dawud";
    case "nasai": return "An-Nasai";
    case "ibnmajah": return "Ibn Majah";
    case "malik": return "Imam Malik";
    default: return "";
  }
}

// ============================================
// TEXT PARSING
// ============================================

/**
 * Extract narrator name from hadith English text
 */
function extractNarrator(text: string): string {
  const patterns = [
    /^Narrated\s+([^:]+):/i,
    /^([^:]+)\s+reported\s*(?:that)?:/i,
    /^([^:]+)\s+narrated\s*(?:that)?:/i,
    /^It was narrated (?:from|on the authority of)\s+([^:,]+)/i,
    /^(?:Abu|Ibn|Umar|Anas|Aisha|Abdullah|Jabir|Ali|Muadh)[^:]{0,50}(?=:)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return (match[1] || match[0]).trim();
    }
  }
  return "";
}

/**
 * Get display name for collection
 */
function getDisplayName(collectionId: string): string {
  return COLLECTION_DISPLAY_NAMES[collectionId] || collectionId.charAt(0).toUpperCase() + collectionId.slice(1);
}

// ============================================
// CDN FETCH HELPERS
// ============================================

/**
 * Fetch JSON from CDN with fallback (.json → .min.json)
 * @param endpoint - CDN endpoint path (without .json extension)
 * @param skipNextCache - If true, skip Next.js fetch cache (for large responses)
 */
async function fetchCDNJson<T>(endpoint: string, skipNextCache = false): Promise<T | null> {
  const fetchOptions: RequestInit = skipNextCache 
    ? { cache: "no-store" } 
    : { next: { revalidate: 3600 } };

  // Try primary URL first
  try {
    const response = await fetch(`${CDN_BASE_URL}/${endpoint}.json`, fetchOptions);
    if (response.ok) {
      return await response.json() as T;
    }
  } catch {
    // Primary failed, try fallback
  }

  // Fallback to minified version
  try {
    const response = await fetch(`${CDN_BASE_URL}/${endpoint}.min.json`, fetchOptions);
    if (response.ok) {
      return await response.json() as T;
    }
  } catch {
    // Both failed
  }

  return null;
}

// ============================================
// PUBLIC API FUNCTIONS
// ============================================

/**
 * Fetch collection metadata (books/sections info) from CDN
 * Returns section names and hadith count per section
 */
export async function fetchCollectionInfo(
  collectionId: string
): Promise<{ sections: Record<string, string>; sectionDetails: Record<string, CDNSectionInfo> } | null> {
  const cdnName = CDN_COLLECTION_MAP[collectionId];
  if (!cdnName) return null;

  // Check info cache
  if (infoCache.data && Date.now() - infoCache.timestamp < INFO_CACHE_TTL) {
    const collectionInfo = infoCache.data[cdnName];
    if (collectionInfo?.metadata) {
      return {
        sections: collectionInfo.metadata.sections || {},
        sectionDetails: collectionInfo.metadata.section_details || {},
      };
    }
  }

  // Fetch info.json from CDN (large file, skip Next.js cache, use our in-memory cache)
  try {
    const data = await fetchCDNJson<HadithInfoData>("info", true);
    if (data) {
      infoCache.data = data;
      infoCache.timestamp = Date.now();

      const collectionInfo = data[cdnName];
      if (collectionInfo?.metadata) {
        return {
          sections: collectionInfo.metadata.sections || {},
          sectionDetails: collectionInfo.metadata.section_details || {},
        };
      }
    }
  } catch (error) {
    console.error(`Error fetching collection info for ${collectionId}:`, error);
  }

  return null;
}

/**
 * Build HadithBook[] from CDN info metadata
 * This provides accurate book data for all collections
 */
export async function fetchCollectionBooks(collectionId: string): Promise<HadithBook[]> {
  const info = await fetchCollectionInfo(collectionId);
  if (!info) return [];

  const books: HadithBook[] = [];
  const sectionEntries = Object.entries(info.sections);

  for (const [sectionNum, sectionName] of sectionEntries) {
    const num = parseInt(sectionNum, 10);
    // Skip invalid sections: NaN, section 0, or sections with no name
    if (isNaN(num) || num <= 0 || !sectionName?.trim()) continue;

    const details = info.sectionDetails[sectionNum];
    const startNum = details?.hadithnumber_first || 0;
    const endNum = details?.hadithnumber_last || 0;
    const hadithCount = (startNum > 0 && endNum > 0) ? (endNum - startNum + 1) : 0;

    books.push({
      bookNumber: num,
      name: sectionName,
      nameArabic: "",
      hadithCount,
      hadithStartNumber: startNum,
      hadithEndNumber: endNum,
    });
  }

  // Sort by book number
  books.sort((a, b) => a.bookNumber - b.bookNumber);
  return books;
}

/**
 * Fetch hadiths from a specific section/book of a collection
 * Uses the /editions/{edition}/sections/{sectionNo} endpoint
 */
export async function fetchSectionFromCDN(
  collectionId: string,
  sectionNumber: number
): Promise<Hadith[]> {
  const cdnName = CDN_COLLECTION_MAP[collectionId];
  if (!cdnName) return [];

  // Check cache
  const cacheKey = `section-${collectionId}-${sectionNumber}`;
  const cached = getCached(sectionCache, cacheKey);
  if (cached) return cached;

  try {
    // Fetch English and Arabic editions in parallel
    const [enData, arData] = await Promise.all([
      fetchCDNJson<{ hadiths: CDNHadith[] }>(`editions/eng-${cdnName}/sections/${sectionNumber}`),
      fetchCDNJson<{ hadiths: CDNHadith[] }>(`editions/ara-${cdnName}/sections/${sectionNumber}`),
    ]);

    if (!enData?.hadiths) return [];

    const enHadiths = enData.hadiths;
    const arHadiths = arData?.hadiths || [];

    // Build a map of Arabic hadiths by number for fast lookup
    const arMap = new Map<number, CDNHadith>();
    for (const arH of arHadiths) {
      if (arH.hadithnumber) {
        arMap.set(arH.hadithnumber, arH);
      }
    }

    const hadiths: Hadith[] = enHadiths.map((enH, index) => {
      const num = enH.hadithnumber || index + 1;
      const arH = arMap.get(num);

      return {
        hadithNumber: num,
        arabicText: arH?.text || "",
        englishText: enH.text || "",
        primaryNarrator: extractNarrator(enH.text || ""),
        grade: parseGrade(enH.grades?.[0]?.grade, collectionId),
        gradedBy: enH.grades?.[0]?.graded_by || enH.grades?.[0]?.name || getDefaultGrader(collectionId),
        bookNumber: enH.reference?.book || sectionNumber,
        chapterNumber: enH.reference?.hadith,
        reference: `${getDisplayName(collectionId)} ${num}`,
        inBookReference: `Book ${enH.reference?.book || sectionNumber}, Hadith ${enH.reference?.hadith || num}`,
      };
    });

    // Cache the result
    sectionCache.set(cacheKey, { data: hadiths, timestamp: Date.now() });
    return hadiths;
  } catch (error) {
    console.error(`Error fetching section ${sectionNumber} of ${collectionId}:`, error);
    return [];
  }
}

/**
 * Fetch a single hadith by number from CDN
 * Uses the /editions/{edition}/{hadithNo} endpoint for efficient single lookups
 */
export async function fetchHadithByNumber(
  collectionId: string,
  hadithNumber: number
): Promise<Hadith | null> {
  const cdnName = CDN_COLLECTION_MAP[collectionId];
  if (!cdnName) return null;

  try {
    // Fetch English and Arabic in parallel
    const [enData, arData] = await Promise.all([
      fetchCDNJson<{ hadiths: CDNHadith[] }>(`editions/eng-${cdnName}/${hadithNumber}`),
      fetchCDNJson<{ hadiths: CDNHadith[] }>(`editions/ara-${cdnName}/${hadithNumber}`),
    ]);

    if (!enData?.hadiths?.[0]) return null;

    const enH = enData.hadiths[0];
    const arH = arData?.hadiths?.[0];

    return {
      hadithNumber: enH.hadithnumber || hadithNumber,
      arabicText: arH?.text || "",
      englishText: enH.text || "",
      primaryNarrator: extractNarrator(enH.text || ""),
      grade: parseGrade(enH.grades?.[0]?.grade, collectionId),
      gradedBy: enH.grades?.[0]?.graded_by || enH.grades?.[0]?.name || getDefaultGrader(collectionId),
      bookNumber: enH.reference?.book || 1,
      chapterNumber: enH.reference?.hadith,
      reference: `${getDisplayName(collectionId)} ${enH.hadithnumber || hadithNumber}`,
      inBookReference: `Book ${enH.reference?.book || 1}, Hadith ${enH.reference?.hadith || hadithNumber}`,
    };
  } catch (error) {
    console.error(`Error fetching hadith ${hadithNumber} from ${collectionId}:`, error);
    return null;
  }
}

/**
 * Fetch full minified collection from CDN (English + Arabic)
 * WARNING: Large payload — use sparingly, prefer section-based fetching
 */
export async function fetchMinifiedCollection(
  collectionId: string
): Promise<Hadith[]> {
  const cdnName = CDN_COLLECTION_MAP[collectionId];
  if (!cdnName) return [];

  // Check cache
  const cacheKey = `full-${collectionId}`;
  const cached = getCached(sectionCache, cacheKey);
  if (cached) return cached;

  try {
    // Fetch English (minified for speed) and Arabic in parallel
    const [enData, arData] = await Promise.all([
      fetchCDNJson<{ hadiths: CDNHadith[] }>(`editions/eng-${cdnName}.min`),
      fetchCDNJson<{ hadiths: CDNHadith[] }>(`editions/ara-${cdnName}.min`),
    ]);

    if (!enData?.hadiths) return [];

    // Build Arabic lookup map
    const arMap = new Map<number, CDNHadith>();
    if (arData?.hadiths) {
      for (const arH of arData.hadiths) {
        if (arH.hadithnumber) {
          arMap.set(arH.hadithnumber, arH);
        }
      }
    }

    const hadiths: Hadith[] = enData.hadiths.map((enH, index) => {
      const num = enH.hadithnumber || index + 1;
      const arH = arMap.get(num);

      return {
        hadithNumber: num,
        arabicText: arH?.text || "",
        englishText: enH.text || "",
        primaryNarrator: extractNarrator(enH.text || ""),
        grade: parseGrade(enH.grades?.[0]?.grade, collectionId),
        gradedBy: enH.grades?.[0]?.graded_by || enH.grades?.[0]?.name || getDefaultGrader(collectionId),
        bookNumber: enH.reference?.book || 1,
        reference: `${getDisplayName(collectionId)} ${num}`,
        inBookReference: `Book ${enH.reference?.book || 1}, Hadith ${num}`,
      };
    });

    // Cache the result
    sectionCache.set(cacheKey, { data: hadiths, timestamp: Date.now() });
    return hadiths;
  } catch (error) {
    console.error(`Error fetching minified ${collectionId}:`, error);
    return [];
  }
}

/**
 * Fetch editions list from CDN
 * Returns available hadith editions with language info
 */
export async function fetchEditionsInfo(): Promise<Record<string, unknown> | null> {
  try {
    return await fetchCDNJson<Record<string, unknown>>("editions");
  } catch (error) {
    console.error("Error fetching editions info:", error);
    return null;
  }
}

/**
 * Check if a collection is supported by the CDN
 */
export function isCDNCollection(collectionId: string): boolean {
  return collectionId in CDN_COLLECTION_MAP;
}

/**
 * Clear all caches (useful for forcing refresh)
 */
export function clearCaches(): void {
  sectionCache.clear();
  infoCache.data = null;
  infoCache.timestamp = 0;
}
