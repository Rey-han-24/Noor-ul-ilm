/**
 * Quran API Utility
 * 
 * Fetches authentic Quranic text from the Al-Quran Cloud API.
 * This ensures 100% accuracy of Uthmani script from verified sources.
 * 
 * API Source: https://alquran.cloud/api
 * - Provides authentic Uthmani script
 * - Multiple verified translations
 * - Trusted by millions of Muslims worldwide
 */

import { SurahDetail, AyahTranslation } from "@/types/quran";

const API_BASE_URL = "https://api.alquran.cloud/v1";

/**
 * API Response wrapper type
 */
interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

/**
 * Fetches a complete Surah with Arabic text (Uthmani script)
 * 
 * @param surahNumber - Surah number (1-114)
 * @returns Promise<SurahDetail> - Complete Surah data with all verses
 * @throws Error if API call fails or surah not found
 */
export async function getSurah(surahNumber: number): Promise<SurahDetail> {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid Surah number: ${surahNumber}. Must be between 1 and 114.`);
  }

  try {
    // Using quran-uthmani for authentic Uthmani script
    const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/quran-uthmani`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Surah ${surahNumber}: ${response.statusText}`);
    }

    const result: ApiResponse<SurahDetail> = await response.json();

    if (result.code !== 200 || result.status !== "OK") {
      throw new Error(`API error for Surah ${surahNumber}: ${result.status}`);
    }

    return result.data;
  } catch (error) {
    console.error(`Error fetching Surah ${surahNumber}:`, error);
    throw error;
  }
}

/**
 * Fetches translation for a Surah
 * 
 * @param surahNumber - Surah number (1-114)
 * @param edition - Translation edition identifier (e.g., "en.sahih")
 * @returns Promise<AyahTranslation[]> - Array of translated verses
 */
export async function getSurahTranslation(
  surahNumber: number,
  edition: string = "en.sahih"
): Promise<AyahTranslation[]> {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid Surah number: ${surahNumber}. Must be between 1 and 114.`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/${edition}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch translation for Surah ${surahNumber}: ${response.statusText}`);
    }

    const result: ApiResponse<{ ayahs: AyahTranslation[] }> = await response.json();

    if (result.code !== 200 || result.status !== "OK") {
      throw new Error(`API error for translation: ${result.status}`);
    }

    return result.data.ayahs;
  } catch (error) {
    console.error(`Error fetching translation for Surah ${surahNumber}:`, error);
    throw error;
  }
}

/**
 * Fetches both Arabic text and translation for a Surah
 * 
 * @param surahNumber - Surah number (1-114)
 * @param translationEdition - Translation edition identifier
 * @returns Promise with Surah data and translations
 */
export async function getSurahWithTranslation(
  surahNumber: number,
  translationEdition: string = "en.sahih"
): Promise<{
  surah: SurahDetail;
  translations: AyahTranslation[];
}> {
  // Fetch both in parallel for better performance
  const [surah, translations] = await Promise.all([
    getSurah(surahNumber),
    getSurahTranslation(surahNumber, translationEdition),
  ]);

  return { surah, translations };
}

/**
 * Converts a number to Arabic-Indic numerals
 * Used for displaying verse numbers in Arabic style
 * 
 * @param num - Number to convert
 * @returns String with Arabic-Indic numerals
 */
export function toArabicNumeral(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit)])
    .join("");
}

/**
 * Gets the Bismillah text (shown at start of most Surahs)
 * Not shown for Surah At-Tawbah (9)
 */
export const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
export const BISMILLAH_TRANSLATION = "In the name of Allah, the Most Gracious, the Most Merciful";

/**
 * Removes the Bismillah from the beginning of Arabic text
 * This is needed because the API includes Bismillah in verse 1 of most surahs
 * but translations don't include it (since it's shown separately)
 * 
 * The Al-Quran Cloud API returns Bismillah as part of verse 1 for all surahs
 * (except Al-Fatiha where it IS verse 1, and At-Tawbah which has no Bismillah).
 * 
 * Strategy: Look for the ending of Bismillah (الرحيم or variations) and 
 * extract everything after it.
 * 
 * @param text - The Arabic text that may contain Bismillah
 * @param surahNumber - The surah number (needed to know if we should strip it)
 * @param ayahNumber - The verse number (only strip from verse 1)
 * @returns The text with Bismillah removed if applicable
 */
export function stripBismillahFromText(
  text: string, 
  surahNumber: number, 
  ayahNumber: number
): string {
  // Only process verse 1
  if (ayahNumber !== 1) return text;
  
  // Don't strip from Al-Fatiha - Bismillah IS verse 1
  if (surahNumber === 1) return text;
  
  // Don't process At-Tawbah - it doesn't have Bismillah
  if (surahNumber === 9) return text;
  
  const trimmedText = text.trim();
  
  // Check if text starts with "بسم" (beginning of Bismillah)
  // Using the base letters without all diacritics for more robust matching
  if (!trimmedText.startsWith("بِ") && !trimmedText.startsWith("بِّ") && !trimmedText.startsWith("ب")) {
    return trimmedText; // Doesn't start with Bismillah
  }
  
  // Look for "الرحيم" (end of Bismillah) - with various diacritical marks
  // The patterns to look for (ending of Bismillah):
  const endPatterns = [
    "ٱلرَّحِيمِ",  // With alif wasla
    "الرَّحِيمِ",  // With regular alif  
    "الرحيم",     // Without diacritics
  ];
  
  for (const endPattern of endPatterns) {
    const endIndex = trimmedText.indexOf(endPattern);
    if (endIndex !== -1) {
      // Found the end of Bismillah, extract everything after it
      const afterBismillah = trimmedText.substring(endIndex + endPattern.length).trim();
      if (afterBismillah.length > 0) {
        return afterBismillah;
      }
    }
  }
  
  // If no pattern matched, return original text
  return trimmedText;
}
