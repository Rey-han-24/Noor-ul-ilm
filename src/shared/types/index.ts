/**
 * Noor ul Ilm - TypeScript Type Definitions
 *
 * This file contains all shared TypeScript types and interfaces
 * used throughout the application. Keeping types centralized ensures
 * consistency and makes maintenance easier.
 */

// ============================================
// QURAN TYPES
// ============================================

/**
 * Represents a single verse (Ayah) from the Quran
 */
export interface QuranVerse {
  /** Unique verse ID (e.g., "2:255" for Ayatul Kursi) */
  id: string;
  /** Surah (chapter) number (1-114) */
  surahNumber: number;
  /** Verse number within the surah */
  verseNumber: number;
  /** Arabic text of the verse (Uthmani script) */
  arabicText: string;
  /** Transliteration in Latin characters */
  transliteration?: string;
  /** Translations in different languages */
  translations: Translation[];
  /** Juz (part) number (1-30) */
  juzNumber: number;
  /** Page number in standard Mushaf */
  pageNumber: number;
}

/**
 * Represents a Surah (chapter) of the Quran
 */
export interface Surah {
  /** Surah number (1-114) */
  number: number;
  /** Arabic name of the surah */
  nameArabic: string;
  /** English name of the surah */
  nameEnglish: string;
  /** English translation of the surah name */
  nameTranslation: string;
  /** Total number of verses in the surah */
  totalVerses: number;
  /** Revelation type: Meccan or Medinan */
  revelationType: "meccan" | "medinan";
  /** Order of revelation */
  revelationOrder: number;
}

/**
 * Translation of Islamic text
 */
export interface Translation {
  /** Language code (e.g., "en", "ur", "fr") */
  language: string;
  /** Full language name */
  languageName: string;
  /** Translator name for attribution */
  translator: string;
  /** The translated text */
  text: string;
}

// ============================================
// HADITH TYPES
// ============================================

/**
 * Represents a Hadith collection (e.g., Sahih Bukhari)
 */
export interface HadithCollection {
  /** Unique identifier for the collection */
  id: string;
  /** Name in Arabic */
  nameArabic: string;
  /** Name in English */
  nameEnglish: string;
  /** Author of the collection */
  author: string;
  /** Total number of hadiths */
  totalHadiths: number;
  /** Total number of books/chapters */
  totalBooks: number;
  /** Description of the collection */
  description: string;
}

/**
 * Represents a book/chapter within a Hadith collection
 */
export interface HadithBook {
  /** Unique identifier */
  id: string;
  /** Collection this book belongs to */
  collectionId: string;
  /** Book number within the collection */
  bookNumber: number;
  /** Arabic name */
  nameArabic: string;
  /** English name */
  nameEnglish: string;
  /** Number of hadiths in this book */
  hadithCount: number;
}

/**
 * Represents a single Hadith
 */
export interface Hadith {
  /** Unique identifier */
  id: string;
  /** Collection ID (e.g., "bukhari", "muslim") */
  collectionId: string;
  /** Book number */
  bookNumber: number;
  /** Hadith number within the book */
  hadithNumber: number;
  /** Arabic text */
  arabicText: string;
  /** Chain of narrators (Isnad) */
  narratorChain: string;
  /** English translation */
  englishText: string;
  /** Additional translations */
  translations: Translation[];
  /** Grading (Sahih, Hasan, Da'if, etc.) */
  grade: HadithGrade;
  /** Topics/tags for categorization */
  topics: string[];
}

/**
 * Hadith authenticity grading
 */
export type HadithGrade =
  | "sahih" // Authentic
  | "hasan" // Good
  | "daif" // Weak
  | "maudu" // Fabricated
  | "unknown"; // Not graded

// ============================================
// USER TYPES
// ============================================

/**
 * User account information
 */
export interface User {
  /** Unique user ID */
  id: string;
  /** User's email address */
  email: string;
  /** Display name */
  name: string;
  /** Profile image URL */
  avatarUrl?: string;
  /** Account creation date */
  createdAt: Date;
  /** Preferred language for translations */
  preferredLanguage: string;
  /** User's bookmarks */
  bookmarks: Bookmark[];
}

/**
 * Bookmark for saving verses or hadiths
 */
export interface Bookmark {
  /** Unique bookmark ID */
  id: string;
  /** Type of content bookmarked */
  type: "quran" | "hadith";
  /** Reference to the content */
  contentId: string;
  /** User-added note */
  note?: string;
  /** When the bookmark was created */
  createdAt: Date;
}

// ============================================
// SEARCH TYPES
// ============================================

/**
 * Search result item
 */
export interface SearchResult {
  /** Type of result */
  type: "quran" | "hadith";
  /** Unique identifier */
  id: string;
  /** Title/reference (e.g., "Al-Baqarah 2:255") */
  title: string;
  /** Preview of the content */
  snippet: string;
  /** Arabic text if available */
  arabicText?: string;
  /** Relevance score */
  score: number;
}

/**
 * Search query parameters
 */
export interface SearchQuery {
  /** Search text */
  query: string;
  /** Filter by type */
  type?: "quran" | "hadith" | "all";
  /** Language for results */
  language?: string;
  /** Maximum results to return */
  limit?: number;
  /** Offset for pagination */
  offset?: number;
}

// ============================================
// DONATION TYPES
// ============================================

/**
 * Donation/Charity cause
 */
export interface CharityCause {
  /** Unique identifier */
  id: string;
  /** Cause title */
  title: string;
  /** Description */
  description: string;
  /** Target amount in USD */
  targetAmount: number;
  /** Currently raised amount */
  raisedAmount: number;
  /** Image URL */
  imageUrl?: string;
  /** Whether the cause is active */
  isActive: boolean;
}

/**
 * Donation record
 */
export interface Donation {
  /** Unique donation ID */
  id: string;
  /** User ID (null for anonymous) */
  userId?: string;
  /** Cause ID */
  causeId: string;
  /** Amount in USD */
  amount: number;
  /** Currency used */
  currency: string;
  /** Payment status */
  status: "pending" | "completed" | "failed" | "refunded";
  /** Timestamp */
  createdAt: Date;
  /** Whether donor wants to be anonymous */
  isAnonymous: boolean;
}
