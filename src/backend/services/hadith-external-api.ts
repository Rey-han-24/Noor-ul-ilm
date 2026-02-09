/**
 * Hadith External API Service
 * 
 * Fetches hadith data from external APIs.
 * Uses multiple sources for reliability:
 * 1. cdn.jsdelivr.net - Free CDN hosting hadith JSON data
 * 2. Local fallback data
 */

import { Hadith, HadithGrade } from "@/shared/types/hadith";

// CDN URL for hadith data (uses hadith-api repository)
const CDN_BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";

/**
 * Collection name mapping for the CDN
 */
const CDN_COLLECTION_MAP: Record<string, string> = {
  bukhari: "bukhari",
  muslim: "muslim", 
  tirmidhi: "tirmidhi",
  abudawud: "abudawud",
  nasai: "nasai",
  ibnmajah: "ibnmajah",
  malik: "malik",
};

/**
 * Parse grade from text
 */
function parseGrade(gradeText?: string): HadithGrade {
  if (!gradeText) return "Sahih"; // Default for Bukhari/Muslim
  const lower = gradeText.toLowerCase();
  if (lower.includes("sahih")) return "Sahih";
  if (lower.includes("hasan")) return "Hasan";
  if (lower.includes("da'if") || lower.includes("weak")) return "Da'if";
  return "Unknown";
}

/**
 * Fetch hadith editions info from CDN
 */
export async function fetchEditionsInfo(): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(`${CDN_BASE_URL}/info.json`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });
    
    if (!response.ok) {
      console.warn("Failed to fetch editions info:", response.status);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching editions info:", error);
    return null;
  }
}

/**
 * Fetch hadiths for a collection section from CDN
 * The API returns hadiths in sections of ~300 hadiths each
 */
export async function fetchHadithsFromCDN(
  collectionId: string,
  section: number = 1
): Promise<Hadith[]> {
  const cdnCollection = CDN_COLLECTION_MAP[collectionId];
  if (!cdnCollection) {
    console.warn(`Unknown collection: ${collectionId}`);
    return [];
  }

  try {
    // Fetch English edition
    const enResponse = await fetch(
      `${CDN_BASE_URL}/editions/eng-${cdnCollection}/${section}.json`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    // Fetch Arabic edition
    const arResponse = await fetch(
      `${CDN_BASE_URL}/editions/ara-${cdnCollection}/${section}.json`,
      { next: { revalidate: 3600 } }
    );

    if (!enResponse.ok) {
      console.warn(`Failed to fetch ${collectionId} section ${section}:`, enResponse.status);
      return [];
    }

    const enData = await enResponse.json();
    const arData = arResponse.ok ? await arResponse.json() : null;

    // Parse the hadiths
    const hadiths: Hadith[] = [];
    const enHadiths = enData.hadiths || [];
    const arHadiths = arData?.hadiths || [];

    for (let i = 0; i < enHadiths.length; i++) {
      const enHadith = enHadiths[i];
      const arHadith = arHadiths[i];

      hadiths.push({
        hadithNumber: enHadith.hadithnumber || i + 1,
        arabicText: arHadith?.text || "",
        englishText: enHadith.text || "",
        primaryNarrator: extractNarrator(enHadith.text || ""),
        grade: parseGrade(enHadith.grades?.[0]?.grade),
        gradedBy: enHadith.grades?.[0]?.graded_by || getDefaultGrader(collectionId),
        bookNumber: enHadith.reference?.book || 1,
        chapterNumber: enHadith.reference?.hadith || 1,
        reference: `${capitalize(collectionId)} ${enHadith.hadithnumber}`,
        inBookReference: `Book ${enHadith.reference?.book || 1}, Hadith ${enHadith.reference?.hadith || enHadith.hadithnumber}`,
      });
    }

    return hadiths;
  } catch (error) {
    console.error(`Error fetching ${collectionId} from CDN:`, error);
    return [];
  }
}

/**
 * Fetch all sections of a collection
 */
export async function fetchAllHadithsFromCDN(
  collectionId: string,
  maxSections: number = 5
): Promise<Hadith[]> {
  const allHadiths: Hadith[] = [];
  
  for (let section = 1; section <= maxSections; section++) {
    const sectionHadiths = await fetchHadithsFromCDN(collectionId, section);
    if (sectionHadiths.length === 0) break; // No more sections
    allHadiths.push(...sectionHadiths);
  }
  
  return allHadiths;
}

/**
 * Fetch a specific hadith by number
 */
export async function fetchHadithByNumber(
  collectionId: string,
  hadithNumber: number
): Promise<Hadith | null> {
  const cdnCollection = CDN_COLLECTION_MAP[collectionId];
  if (!cdnCollection) return null;

  try {
    // Calculate which section the hadith is in (approx 300 per section)
    const section = Math.ceil(hadithNumber / 300);
    const hadiths = await fetchHadithsFromCDN(collectionId, section);
    
    return hadiths.find(h => h.hadithNumber === hadithNumber) || null;
  } catch (error) {
    console.error(`Error fetching hadith ${hadithNumber}:`, error);
    return null;
  }
}

/**
 * Get min.json endpoint for a collection (contains all hadiths in one file)
 */
export async function fetchMinifiedCollection(
  collectionId: string
): Promise<Hadith[]> {
  const cdnCollection = CDN_COLLECTION_MAP[collectionId];
  if (!cdnCollection) return [];

  try {
    const response = await fetch(
      `${CDN_BASE_URL}/editions/eng-${cdnCollection}.min.json`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.warn(`Failed to fetch minified ${collectionId}:`, response.status);
      return [];
    }

    const data = await response.json();
    const rawHadiths = data.hadiths || [];

    return rawHadiths.map((h: {
      hadithnumber?: number;
      text?: string;
      grades?: { grade?: string; graded_by?: string }[];
      reference?: { book?: number; hadith?: number };
    }, index: number) => ({
      hadithNumber: h.hadithnumber || index + 1,
      arabicText: "",
      englishText: h.text || "",
      primaryNarrator: extractNarrator(h.text || ""),
      grade: parseGrade(h.grades?.[0]?.grade),
      gradedBy: h.grades?.[0]?.graded_by || getDefaultGrader(collectionId),
      bookNumber: h.reference?.book || 1,
      reference: `${capitalize(collectionId)} ${h.hadithnumber || index + 1}`,
      inBookReference: `Book ${h.reference?.book || 1}, Hadith ${h.hadithnumber || index + 1}`,
    }));
  } catch (error) {
    console.error(`Error fetching minified ${collectionId}:`, error);
    return [];
  }
}

/**
 * Extract narrator name from hadith text
 */
function extractNarrator(text: string): string {
  const patterns = [
    /^Narrated\s+([^:]+):/i,
    /^([^:]+)\s+reported:/i,
    /^([^:]+)\s+narrated:/i,
    /^It was narrated from\s+([^:]+)/i,
    /^It was narrated on the authority of\s+([^:]+)/i,
    /^(?:Abu|Ibn|Umar|Anas|Aisha|Abdullah|Jabir)[^:]+/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1]?.trim() || match[0].trim();
    }
  }

  return "";
}

/**
 * Get default grader for Sahihayn
 */
function getDefaultGrader(collectionId: string): string {
  switch (collectionId) {
    case "bukhari": return "Al-Bukhari";
    case "muslim": return "Muslim";
    default: return "";
  }
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
