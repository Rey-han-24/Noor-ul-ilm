/**
 * Noor ul Ilm - Application Constants
 *
 * Centralized configuration and constants for the application.
 * This ensures consistency and makes updates easier.
 */

// ============================================
// APP CONFIGURATION
// ============================================

export const APP_CONFIG = {
  name: "Noor ul Ilm",
  nameArabic: "نور العلم",
  tagline: "Light of Knowledge",
  description:
    "Your comprehensive Islamic resource for Quran, Hadith, and authentic Islamic teachings.",
  url: "https://noorulilm.com", // Update when domain is set
  email: "contact@noorulilm.com",
  brandColors: {
    primary: "#0a0a0a", // Royal Black
    gold: "#d4af37", // Royal Gold
  },
} as const;

// ============================================
// SUPPORTED LANGUAGES
// ============================================

/**
 * Languages supported for Quran translations
 * ISO 639-1 language codes
 */
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", direction: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl" },
  { code: "ur", name: "Urdu", nativeName: "اردو", direction: "rtl" },
  { code: "fr", name: "French", nativeName: "Français", direction: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", direction: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", direction: "ltr" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", direction: "ltr" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", direction: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", direction: "ltr" },
] as const;

export const DEFAULT_LANGUAGE = "en";

// ============================================
// HADITH COLLECTIONS
// ============================================

/**
 * Major Hadith collections available in the app
 * Listed in order of traditional importance
 */
export const HADITH_COLLECTIONS = [
  {
    id: "bukhari",
    nameEnglish: "Sahih al-Bukhari",
    nameArabic: "صحيح البخاري",
    author: "Imam Muhammad al-Bukhari",
    totalHadiths: 7563,
    description:
      "Considered the most authentic collection of Hadith, compiled by Imam Bukhari.",
  },
  {
    id: "muslim",
    nameEnglish: "Sahih Muslim",
    nameArabic: "صحيح مسلم",
    author: "Imam Muslim ibn al-Hajjaj",
    totalHadiths: 7500,
    description:
      "The second most authentic collection, compiled by Imam Muslim.",
  },
  {
    id: "abudawud",
    nameEnglish: "Sunan Abu Dawud",
    nameArabic: "سنن أبي داود",
    author: "Imam Abu Dawud",
    totalHadiths: 5274,
    description: "One of the six major Hadith collections.",
  },
  {
    id: "tirmidhi",
    nameEnglish: "Jami at-Tirmidhi",
    nameArabic: "جامع الترمذي",
    author: "Imam at-Tirmidhi",
    totalHadiths: 3956,
    description: "Known for its unique grading system of Hadith.",
  },
  {
    id: "nasai",
    nameEnglish: "Sunan an-Nasa'i",
    nameArabic: "سنن النسائي",
    author: "Imam an-Nasa'i",
    totalHadiths: 5761,
    description: "Known for its strict criteria in Hadith selection.",
  },
  {
    id: "ibnmajah",
    nameEnglish: "Sunan Ibn Majah",
    nameArabic: "سنن ابن ماجه",
    author: "Imam Ibn Majah",
    totalHadiths: 4341,
    description: "The sixth book of the six major Hadith collections.",
  },
] as const;

// ============================================
// QURAN CONFIGURATION
// ============================================

export const QURAN_CONFIG = {
  totalSurahs: 114,
  totalVerses: 6236,
  totalJuz: 30,
  totalPages: 604, // Standard Madani Mushaf
} as const;

// ============================================
// API ENDPOINTS (for future use)
// ============================================

export const API_ENDPOINTS = {
  quran: "/api/quran",
  hadith: "/api/hadith",
  search: "/api/search",
  user: "/api/user",
  donate: "/api/donate",
} as const;

// ============================================
// UI CONSTANTS
// ============================================

export const UI_CONFIG = {
  /** Items per page for pagination */
  itemsPerPage: 20,
  /** Maximum search results to show */
  maxSearchResults: 50,
  /** Debounce delay for search input (ms) */
  searchDebounceMs: 300,
} as const;

// ============================================
// NAVIGATION LINKS
// ============================================

export const NAV_LINKS = [
  { href: "/", label: "Home", labelArabic: "الرئيسية" },
  { href: "/quran", label: "Quran", labelArabic: "القرآن" },
  { href: "/hadith", label: "Hadith", labelArabic: "الحديث" },
  { href: "/search", label: "Search", labelArabic: "البحث" },
  { href: "/donate", label: "Donate", labelArabic: "تبرع" },
] as const;
