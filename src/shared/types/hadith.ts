/**
 * Hadith Types
 * 
 * Type definitions for Hadith data structures.
 * Supports multiple Hadith collections with proper grading and references.
 */

/**
 * Hadith grading levels
 * - Sahih: Authentic, highest level of authenticity
 * - Hasan: Good, acceptable level of authenticity
 * - Da'if: Weak, has some deficiency in the chain
 * - Mawdu: Fabricated, not authentic
 */
export type HadithGrade = "Sahih" | "Hasan" | "Da'if" | "Mawdu" | "Unknown";

/**
 * Hadith Collection metadata
 */
export interface HadithCollection {
  /** Unique identifier (e.g., "bukhari", "muslim") */
  id: string;
  /** English name of the collection */
  name: string;
  /** Arabic name of the collection */
  nameArabic: string;
  /** Full name of the compiler */
  compilerName: string;
  /** Arabic name of the compiler */
  compilerNameArabic: string;
  /** Total number of hadiths in collection */
  totalHadiths: number;
  /** Total number of books/chapters */
  totalBooks: number;
  /** Short description of the collection */
  description: string;
  /** Death year of compiler (Hijri) */
  compilerDeathYear: number;
}

/**
 * Book/Chapter within a Hadith collection
 */
export interface HadithBook {
  /** Book number within the collection */
  bookNumber: number;
  /** English name of the book */
  name: string;
  /** Arabic name of the book */
  nameArabic: string;
  /** Number of hadiths in this book */
  hadithCount: number;
  /** Starting hadith number */
  hadithStartNumber: number;
  /** Ending hadith number */
  hadithEndNumber: number;
}

/**
 * Individual Hadith entry
 */
export interface Hadith {
  /** Unique hadith number in the collection */
  hadithNumber: number;
  /** Arabic text of the hadith */
  arabicText: string;
  /** English translation */
  englishText: string;
  /** Narrator chain (Isnad) */
  narratorChain?: string;
  /** Arabic narrator chain */
  narratorChainArabic?: string;
  /** Primary narrator (Sahabi) */
  primaryNarrator?: string;
  /** Arabic name of primary narrator */
  primaryNarratorArabic?: string;
  /** Hadith grading */
  grade: HadithGrade;
  /** Who graded this hadith */
  gradedBy?: string;
  /** Book number */
  bookNumber: number;
  /** Chapter number within book */
  chapterNumber?: number;
  /** Chapter title */
  chapterTitle?: string;
  /** Arabic chapter title */
  chapterTitleArabic?: string;
  /** Reference string (e.g., "Bukhari 1") */
  reference: string;
  /** In-book reference */
  inBookReference?: string;
}

/**
 * Hadith with collection context
 */
export interface HadithWithCollection extends Hadith {
  /** Collection ID */
  collectionId: string;
  /** Collection name */
  collectionName: string;
}

/**
 * Saved Hadith bookmark
 */
export interface HadithBookmark {
  /** Collection ID */
  collectionId: string;
  /** Collection name */
  collectionName: string;
  /** Book number */
  bookNumber: number;
  /** Hadith number */
  hadithNumber: number;
  /** Preview of hadith text (first 100 chars) */
  textPreview: string;
  /** Timestamp when bookmarked */
  timestamp: number;
}

/**
 * All available Hadith collections
 */
export const HADITH_COLLECTIONS: HadithCollection[] = [
  {
    id: "bukhari",
    name: "Sahih al-Bukhari",
    nameArabic: "صحيح البخاري",
    compilerName: "Imam Muhammad al-Bukhari",
    compilerNameArabic: "الإمام محمد بن إسماعيل البخاري",
    totalHadiths: 7563,
    totalBooks: 97,
    description: "The most authentic collection of Hadith, compiled by Imam Bukhari. It is considered the most reliable source after the Quran.",
    compilerDeathYear: 256,
  },
  {
    id: "muslim",
    name: "Sahih Muslim",
    nameArabic: "صحيح مسلم",
    compilerName: "Imam Muslim ibn al-Hajjaj",
    compilerNameArabic: "الإمام مسلم بن الحجاج",
    totalHadiths: 7500,
    totalBooks: 56,
    description: "The second most authentic collection, known for its excellent arrangement and strict criteria.",
    compilerDeathYear: 261,
  },
  {
    id: "tirmidhi",
    name: "Jami` at-Tirmidhi",
    nameArabic: "جامع الترمذي",
    compilerName: "Imam Abu Isa at-Tirmidhi",
    compilerNameArabic: "الإمام أبو عيسى الترمذي",
    totalHadiths: 3956,
    totalBooks: 49,
    description: "Known for including the grading of each hadith and valuable jurisprudential discussions.",
    compilerDeathYear: 279,
  },
  {
    id: "abudawud",
    name: "Sunan Abu Dawud",
    nameArabic: "سنن أبي داود",
    compilerName: "Imam Abu Dawud as-Sijistani",
    compilerNameArabic: "الإمام أبو داود السجستاني",
    totalHadiths: 5274,
    totalBooks: 43,
    description: "Focuses primarily on legal hadiths and is an essential source for Islamic jurisprudence.",
    compilerDeathYear: 275,
  },
  {
    id: "nasai",
    name: "Sunan an-Nasa'i",
    nameArabic: "سنن النسائي",
    compilerName: "Imam Ahmad an-Nasa'i",
    compilerNameArabic: "الإمام أحمد بن شعيب النسائي",
    totalHadiths: 5761,
    totalBooks: 51,
    description: "Known for its strict criteria in selecting hadiths, focusing on narrator criticism.",
    compilerDeathYear: 303,
  },
  {
    id: "ibnmajah",
    name: "Sunan Ibn Majah",
    nameArabic: "سنن ابن ماجه",
    compilerName: "Imam Ibn Majah al-Qazwini",
    compilerNameArabic: "الإمام ابن ماجه القزويني",
    totalHadiths: 4341,
    totalBooks: 37,
    description: "Contains many unique hadiths not found in other collections, completing the six major books.",
    compilerDeathYear: 273,
  },
];

/**
 * Grade color mapping for UI
 */
export const GRADE_COLORS: Record<HadithGrade, { bg: string; text: string; border: string }> = {
  Sahih: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/30",
  },
  Hasan: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/30",
  },
  "Da'if": {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/30",
  },
  Mawdu: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    border: "border-red-500/30",
  },
  Unknown: {
    bg: "bg-gray-500/10",
    text: "text-gray-500",
    border: "border-gray-500/30",
  },
};

/**
 * Get collection by ID
 */
export function getCollectionById(id: string): HadithCollection | undefined {
  return HADITH_COLLECTIONS.find((c) => c.id === id);
}
