/**
 * Hadith Data Index
 * 
 * @deprecated This module is deprecated. All hadith data is now fetched from hadithapi.com.
 * Use the hadith-api service instead: import { ... } from "@/backend/services/hadith-api"
 * 
 * This file is kept only for backward compatibility with type exports.
 */

/**
 * Collection IDs for the hadith collections
 */
export const COLLECTION_IDS = {
  BUKHARI: "bukhari",
  MUSLIM: "muslim",
  TIRMIDHI: "tirmidhi",
  ABU_DAWUD: "abudawud",
  NASAI: "nasai",
  IBN_MAJAH: "ibnmajah",
} as const;

