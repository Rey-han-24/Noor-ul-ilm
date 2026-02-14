/**
 * Tafsir (Quran Commentary) Types
 * 
 * Type definitions for Tafsir data structures.
 * Supports multiple Tafsir sources (Ibn Kathir, Ma'arif al-Qur'an, etc.)
 * 
 * @module shared/types/tafsir
 */

/**
 * Available Tafsir source definition
 */
export interface TafsirSource {
  /** Unique API ID for the tafsir */
  id: number;
  /** Display name */
  name: string;
  /** Author/Scholar name */
  author: string;
  /** Language of the tafsir */
  language: 'en' | 'ar' | 'ur';
  /** API slug for fetching */
  slug: string;
  /** Short description */
  description: string;
}

/**
 * Tafsir content for a single ayah
 */
export interface TafsirContent {
  /** Surah number */
  surahNumber: number;
  /** Ayah number within surah */
  ayahNumber: number;
  /** The tafsir source used */
  sourceId: number;
  /** Source name */
  sourceName: string;
  /** The tafsir text (may contain HTML) */
  text: string;
  /** Language of the tafsir */
  language: string;
}

/**
 * Available Tafsir Sources
 * 
 * English:
 * - Ibn Kathir (Abridged) - Most popular English tafsir
 * - Ma'arif al-Qur'an - Comprehensive by Mufti Muhammad Shafi
 * - Tazkirul Quran - by Maulana Wahiduddin Khan
 * 
 * Arabic:
 * - Tafsir al-Tabari - Classical comprehensive tafsir
 * - Tafsir Ibn Kathir - Full Arabic original
 * - Tafsir al-Jalalayn - Concise and accessible
 * - Tafsir al-Muyassar - Modern, easy to understand
 * - Tafsir al-Qurtubi - Legal and linguistic focus
 * - Tafsir al-Baghawi - Traditional Sunni tafsir
 * - Tafsir al-Sa'di - Modern Saudi tafsir
 * 
 * Urdu:
 * - Tafsir Ibn Kathir (Urdu) - Urdu translation
 * - Bayan ul Quran - by Dr. Israr Ahmad
 * - Fi Zilal al-Quran - by Sayyid Qutb (Urdu)
 */
export const TAFSIR_SOURCES: TafsirSource[] = [
  // English Tafsirs
  {
    id: 169,
    name: 'Ibn Kathir (Abridged)',
    author: 'Hafiz Ibn Kathir',
    language: 'en',
    slug: 'en-tafisr-ibn-kathir',
    description: 'The most widely read English Tafsir. Concise yet comprehensive commentary based on Quran, Sunnah and early scholars.',
  },
  {
    id: 168,
    name: "Ma'arif al-Qur'an",
    author: 'Mufti Muhammad Shafi',
    language: 'en',
    slug: 'en-tafsir-maarif-ul-quran',
    description: 'Comprehensive tafsir covering linguistic, legal and spiritual dimensions of the Quran.',
  },
  {
    id: 817,
    name: 'Tazkirul Quran',
    author: 'Maulana Wahiduddin Khan',
    language: 'en',
    slug: 'tazkirul-quran-en',
    description: 'Modern tafsir emphasizing the relevance of Quranic teachings in contemporary life.',
  },
  // Arabic Tafsirs
  {
    id: 15,
    name: 'Tafsir al-Tabari',
    author: 'Imam al-Tabari',
    language: 'ar',
    slug: 'ar-tafsir-al-tabari',
    description: 'The most comprehensive classical tafsir. The foundation for all subsequent tafsir works.',
  },
  {
    id: 14,
    name: 'Tafsir Ibn Kathir',
    author: 'Hafiz Ibn Kathir',
    language: 'ar',
    slug: 'ar-tafsir-ibn-kathir',
    description: 'Full Arabic original of the famous tafsir based on Quran, Hadith and scholarly consensus.',
  },
  {
    id: 16,
    name: 'Tafsir al-Muyassar',
    author: 'King Fahad Quran Complex',
    language: 'ar',
    slug: 'ar-tafsir-muyassar',
    description: 'Modern, accessible tafsir designed for easy understanding of Quranic meanings.',
  },
  {
    id: 91,
    name: "Tafsir al-Sa'di",
    author: "Imam al-Sa'di",
    language: 'ar',
    slug: 'ar-tafseer-al-saddi',
    description: 'Clear and beneficial modern Saudi tafsir focusing on practical lessons.',
  },
  {
    id: 90,
    name: 'Tafsir al-Qurtubi',
    author: 'Imam al-Qurtubi',
    language: 'ar',
    slug: 'ar-tafseer-al-qurtubi',
    description: 'Classical tafsir with emphasis on legal rulings and Arabic linguistic analysis.',
  },
  {
    id: 94,
    name: 'Tafsir al-Baghawi',
    author: 'Imam al-Baghawi',
    language: 'ar',
    slug: 'ar-tafsir-al-baghawi',
    description: 'Traditional Sunni tafsir known for reliability and balanced approach.',
  },
  // Urdu Tafsirs
  {
    id: 160,
    name: 'Tafsir Ibn Kathir (Urdu)',
    author: 'Hafiz Ibn Kathir / Tawheed Publication',
    language: 'ur',
    slug: 'tafseer-ibn-e-kaseer-urdu',
    description: 'Urdu translation of the renowned Tafsir Ibn Kathir.',
  },
  {
    id: 159,
    name: 'Bayan ul Quran',
    author: 'Dr. Israr Ahmad',
    language: 'ur',
    slug: 'tafsir-bayan-ul-quran',
    description: 'Modern Urdu tafsir by the renowned scholar Dr. Israr Ahmad.',
  },
  {
    id: 157,
    name: 'Fi Zilal al-Quran',
    author: 'Sayyid Ibrahim Qutb',
    language: 'ur',
    slug: 'tafsir-fe-zalul-quran-syed-qatab',
    description: 'Urdu translation of the influential tafsir "In the Shade of the Quran".',
  },
];

/**
 * Get English tafsir sources
 */
export function getEnglishTafsirs(): TafsirSource[] {
  return TAFSIR_SOURCES.filter(t => t.language === 'en');
}

/**
 * Get Arabic tafsir sources
 */
export function getArabicTafsirs(): TafsirSource[] {
  return TAFSIR_SOURCES.filter(t => t.language === 'ar');
}

/**
 * Get Urdu tafsir sources
 */
export function getUrduTafsirs(): TafsirSource[] {
  return TAFSIR_SOURCES.filter(t => t.language === 'ur');
}

/**
 * Get a tafsir source by ID
 */
export function getTafsirSourceById(id: number): TafsirSource | undefined {
  return TAFSIR_SOURCES.find(t => t.id === id);
}

/**
 * Default tafsir source (English Ibn Kathir)
 */
export const DEFAULT_TAFSIR_ID = 169;
