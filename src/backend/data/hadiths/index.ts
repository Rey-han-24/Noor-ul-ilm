/**
 * Hadith Data Index
 * 
 * This module previously contained hardcoded hadith data.
 * Now all hadith data is fetched from hadithapi.com via the hadith-api service.
 * 
 * This file is kept for backward compatibility but exports empty stubs.
 * Use the hadith-api service for actual hadith data.
 * 
 * @module data/hadiths
 * @deprecated Use hadith-api service instead
 */

import { Hadith, HadithBook } from "@/shared/types/hadith";

/**
 * Collection IDs for the hadith collections
 * Kept for backward compatibility
 */
export const COLLECTION_IDS = {
  BUKHARI: "bukhari",
  MUSLIM: "muslim",
  TIRMIDHI: "tirmidhi",
  ABU_DAWUD: "abudawud",
  NASAI: "nasai",
  IBN_MAJAH: "ibnmajah",
} as const;

/**
 * Empty book data - all data now comes from API
 * @deprecated Use getCollectionBooks from hadith-api service
 */
export const COLLECTION_BOOKS: Record<string, HadithBook[]> = {};

/**
 * Get books for a collection
 * @deprecated Use getCollectionBooks from hadith-api service
 */
export function getCollectionBooks(collectionId: string): HadithBook[] {
  console.warn(`[DEPRECATED] getCollectionBooks called for ${collectionId}. Use hadith-api service.`);
  return [];
}

/**
 * Search hadiths - stub for backward compatibility
 * @deprecated Use searchHadiths from hadith-api service
 */
export function searchAllHadiths(_query: string): Hadith[] {
  console.warn(`[DEPRECATED] searchAllHadiths called. Use hadith-api service.`);
  return [];
}

/**
 * Get hadiths by collection and book
 * @deprecated Use getBookHadiths from hadith-api service
 */
export function getHadithsByCollectionAndBook(
  _collectionId: string,
  _bookNumber: number
): Hadith[] {
  console.warn(`[DEPRECATED] getHadithsByCollectionAndBook called. Use hadith-api service.`);
  return [];
}

/**
 * Get all hadiths from a collection
 * @deprecated Use getCollectionHadiths from hadith-api service
 */
export function getAllHadithsByCollection(_collectionId: string): Hadith[] {
  console.warn(`[DEPRECATED] getAllHadithsByCollection called. Use hadith-api service.`);
  return [];
}

/**
 * Get hadith by number
 * @deprecated Use getHadith from hadith-api service
 */
export function getHadithByNumber(
  _collectionId: string,
  _hadithNumber: number
): Hadith | undefined {
  console.warn(`[DEPRECATED] getHadithByNumber called. Use hadith-api service.`);
  return undefined;
}
