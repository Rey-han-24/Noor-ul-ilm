/**
 * Tafsir (Quran Commentary) API Service
 * 
 * Fetches tafsir/commentary data from the Quran.com API (v4).
 * FREE & reliable API with multiple tafsir sources.
 * 
 * API: https://api.quran.com/api/v4
 * 
 * Available English Tafsirs:
 * - Ibn Kathir (Abridged) - ID: 169
 * - Ma'arif al-Qur'an - ID: 168
 * - Tazkirul Quran - ID: 817
 * 
 * Available Arabic Tafsirs:
 * - Tafsir al-Tabari - ID: 15
 * - Tafsir Ibn Kathir - ID: 14
 * - Tafsir al-Muyassar - ID: 16
 * - Tafsir al-Sa'di - ID: 91
 * - Tafsir al-Qurtubi - ID: 90
 * - Tafsir al-Baghawi - ID: 94
 * 
 * @module backend/services/tafsir-api
 */

import { TafsirContent, DEFAULT_TAFSIR_ID } from '@/shared/types/tafsir';

/**
 * Quran.com API v4 base URL
 */
const API_BASE_URL = 'https://api.quran.com/api/v4';

/**
 * API Response type for tafsir endpoint
 */
interface TafsirApiResponse {
  tafsir: {
    verses: Record<string, { id: number }>;
    resource_id: number;
    resource_name: string;
    language_id: number;
    slug: string;
    translated_name: {
      name: string;
      language_name: string;
    };
    text: string;
  };
}

/**
 * In-memory cache for tafsir content to reduce API calls
 * Key format: `${tafsirId}:${surahNumber}:${ayahNumber}`
 */
const tafsirCache = new Map<string, { data: TafsirContent; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour cache

/**
 * Generate cache key for a tafsir request
 */
function getCacheKey(tafsirId: number, surahNumber: number, ayahNumber: number): string {
  return `${tafsirId}:${surahNumber}:${ayahNumber}`;
}

/**
 * Fetch tafsir (commentary) for a specific ayah
 * 
 * @param surahNumber - Surah number (1-114)
 * @param ayahNumber - Ayah number within the surah
 * @param tafsirId - Tafsir source ID (default: 169 = Ibn Kathir English)
 * @returns TafsirContent or null if not found
 * 
 * @example
 * const tafsir = await getTafsirForAyah(2, 255); // Ayatul Kursi tafsir
 * const tafsir = await getTafsirForAyah(1, 1, 168); // Al-Fatiha with Ma'arif al-Qur'an
 */
export async function getTafsirForAyah(
  surahNumber: number,
  ayahNumber: number,
  tafsirId: number = DEFAULT_TAFSIR_ID,
): Promise<TafsirContent | null> {
  // Validate input
  if (surahNumber < 1 || surahNumber > 114) {
    console.error(`Invalid surah number: ${surahNumber}`);
    return null;
  }

  // Check cache first
  const cacheKey = getCacheKey(tafsirId, surahNumber, ayahNumber);
  const cached = tafsirCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const ayahKey = `${surahNumber}:${ayahNumber}`;
    const response = await fetch(
      `${API_BASE_URL}/tafsirs/${tafsirId}/by_ayah/${ayahKey}`,
      {
        next: { revalidate: 86400 }, // Next.js cache: 24 hours
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(`Tafsir API returned ${response.status} for ${ayahKey} (tafsir: ${tafsirId})`);
      return null;
    }

    const data: TafsirApiResponse = await response.json();

    if (!data.tafsir || !data.tafsir.text) {
      return null;
    }

    const tafsirContent: TafsirContent = {
      surahNumber,
      ayahNumber,
      sourceId: data.tafsir.resource_id,
      sourceName: data.tafsir.resource_name,
      text: data.tafsir.text,
      language: data.tafsir.translated_name?.language_name || 'english',
    };

    // Cache the result
    tafsirCache.set(cacheKey, { data: tafsirContent, timestamp: Date.now() });

    return tafsirContent;
  } catch (error) {
    console.error(`Error fetching tafsir for ${surahNumber}:${ayahNumber}:`, error);
    return null;
  }
}

/**
 * Fetch tafsir for multiple ayahs at once (batched)
 * Useful for prefetching tafsir for a whole surah
 * 
 * @param surahNumber - Surah number (1-114)
 * @param ayahNumbers - Array of ayah numbers
 * @param tafsirId - Tafsir source ID
 * @returns Map of ayahNumber -> TafsirContent
 */
export async function getTafsirForAyahs(
  surahNumber: number,
  ayahNumbers: number[],
  tafsirId: number = DEFAULT_TAFSIR_ID,
): Promise<Map<number, TafsirContent>> {
  const results = new Map<number, TafsirContent>();

  // Fetch in parallel with concurrency limit
  const BATCH_SIZE = 5;
  for (let i = 0; i < ayahNumbers.length; i += BATCH_SIZE) {
    const batch = ayahNumbers.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (ayahNumber) => {
      const tafsir = await getTafsirForAyah(surahNumber, ayahNumber, tafsirId);
      if (tafsir) {
        results.set(ayahNumber, tafsir);
      }
    });
    await Promise.all(promises);
  }

  return results;
}

/**
 * Strip HTML tags from tafsir text for plain text display
 * 
 * @param html - Raw HTML tafsir text
 * @returns Plain text without HTML tags
 */
export function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Sanitize HTML tafsir text for safe rendering
 * Allows basic formatting tags but removes scripts and dangerous elements
 * 
 * @param html - Raw HTML from API
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeTafsirHtml(html: string): string {
  return html
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/\s*on\w+="[^"]*"/gi, '')
    .replace(/\s*on\w+='[^']*'/gi, '')
    // Remove style attributes with dangerous values
    .replace(/javascript:/gi, '')
    // Keep basic formatting
    .trim();
}

/**
 * Clear the tafsir cache
 * Useful for freeing memory
 */
export function clearTafsirCache(): void {
  tafsirCache.clear();
}

/**
 * Get cache statistics
 */
export function getTafsirCacheStats(): { size: number; entries: string[] } {
  return {
    size: tafsirCache.size,
    entries: Array.from(tafsirCache.keys()),
  };
}
