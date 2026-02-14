/**
 * Hadith API Utilities
 * 
 * Provides Hadith data from curated local collections AND external CDN.
 * 
 * Data Flow:
 * 1. Local data (Bukhari, Muslim, Nawawi) — hand-curated authentic hadiths
 * 2. CDN data (fawazahmed0/hadith-api) — complete collections with Arabic + English
 * 
 * The system tries local data first, then falls back to CDN for complete data.
 * 
 * @module services/hadith-api
 */

import { 
  Hadith, 
  HadithBook, 
  HadithCollection,
  HADITH_COLLECTIONS 
} from "@/shared/types/hadith";

import {
  getHadithsByCollectionAndBook,
  getAllHadithsByCollection,
  searchAllHadiths,
  getCollectionBooks as getLocalCollectionBooks,
  COLLECTION_BOOKS,
} from "@/backend/data/hadiths";

import { 
  fetchSectionFromCDN, 
  fetchHadithByNumber as fetchExternalHadith,
  fetchCollectionBooks as fetchExternalBooks,
  isCDNCollection,
} from "./hadith-external-api";

/**
 * Get all books in a collection
 * Uses local book data first, then CDN info.json for complete book lists
 */
export async function getCollectionBooks(collectionId: string): Promise<HadithBook[]> {
  // Nawawi is special — only 1 book
  if (collectionId === "nawawi") {
    return getLocalCollectionBooks("nawawi");
  }

  // Try CDN first for complete book data (has all books with accurate hadith counts)
  if (isCDNCollection(collectionId)) {
    try {
      const cdnBooks = await fetchExternalBooks(collectionId);
      if (cdnBooks.length > 0) {
        // Merge with local Arabic names if available
        const localBooks = COLLECTION_BOOKS[collectionId] || [];
        const localBookMap = new Map(localBooks.map(b => [b.bookNumber, b]));

        return cdnBooks.map(cdnBook => {
          const localBook = localBookMap.get(cdnBook.bookNumber);
          return {
            ...cdnBook,
            nameArabic: localBook?.nameArabic || cdnBook.nameArabic || "",
          };
        });
      }
    } catch (error) {
      console.error(`Error fetching CDN books for ${collectionId}:`, error);
    }
  }

  // Fallback to local data
  const localBooks = getLocalCollectionBooks(collectionId);
  if (localBooks.length > 0) {
    return localBooks;
  }

  // Last resort: generated books
  return getMockBooks(collectionId);
}

/**
 * Get hadiths from a specific book (CDN first → local fallback)
 * Always prefers CDN data since it has complete collections.
 * Local data is only used as fallback when CDN is unavailable.
 */
export async function getBookHadiths(
  collectionId: string, 
  bookNumber: number,
  page: number = 1,
  limit: number = 50
): Promise<{ hadiths: Hadith[]; total: number; hasMore: boolean }> {
  let hadiths: Hadith[] = [];

  // Nawawi is local-only (complete set of 42 hadiths)
  if (collectionId === "nawawi") {
    hadiths = getHadithsByCollectionAndBook(collectionId, bookNumber);
  } else if (isCDNCollection(collectionId)) {
    // For all CDN-supported collections, fetch from CDN first (has complete data)
    try {
      const sectionHadiths = await fetchSectionFromCDN(collectionId, bookNumber);
      if (sectionHadiths.length > 0) {
        hadiths = sectionHadiths;
      }
    } catch (error) {
      console.error(`Error fetching CDN section for ${collectionId}/${bookNumber}:`, error);
    }

    // Fallback to local data only if CDN returned nothing
    if (hadiths.length === 0) {
      hadiths = getHadithsByCollectionAndBook(collectionId, bookNumber);
    }
  } else {
    // Non-CDN collections use local data only
    hadiths = getHadithsByCollectionAndBook(collectionId, bookNumber);
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const paginatedHadiths = hadiths.slice(startIndex, startIndex + limit);
  
  return {
    hadiths: paginatedHadiths,
    total: hadiths.length,
    hasMore: startIndex + limit < hadiths.length,
  };
}

/**
 * Get a specific hadith by number (CDN first → local fallback)
 */
export async function getHadith(
  collectionId: string,
  hadithNumber: number
): Promise<Hadith | null> {
  // For CDN collections, try CDN first (more complete data)
  if (isCDNCollection(collectionId)) {
    try {
      const hadith = await fetchExternalHadith(collectionId, hadithNumber);
      if (hadith) return hadith;
    } catch (error) {
      console.error(`Error fetching hadith ${hadithNumber} from CDN:`, error);
    }
  }

  // Fallback to local data
  const allLocal = getAllHadithsByCollection(collectionId);
  const localHadith = allLocal.find(h => h.hadithNumber === hadithNumber);
  return localHadith || null;
}

/**
 * Search hadiths across all collections
 * Currently searches local data. CDN search would require downloading full collections.
 */
export async function searchHadiths(
  query: string,
  collectionId?: string,
  page: number = 1,
  limit: number = 20
): Promise<{ hadiths: Hadith[]; total: number; hasMore: boolean }> {
  if (!query.trim()) {
    return { hadiths: [], total: 0, hasMore: false };
  }

  // Search using local data
  let results = searchAllHadiths(query);
  
  // Filter by collection if specified
  if (collectionId) {
    results = results.filter(h => 
      h.reference?.toLowerCase().startsWith(collectionId.toLowerCase())
    );
  }
  
  // Apply pagination
  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + limit);
  
  return {
    hadiths: paginatedResults,
    total: results.length,
    hasMore: startIndex + limit < results.length,
  };
}

// ============================================
// FALLBACK DATA
// ============================================

/**
 * Book names for each collection (authentic book structure)
 */
const BOOK_NAMES: Record<string, { name: string; nameArabic: string }[]> = {
  bukhari: [
    { name: "Revelation", nameArabic: "بدء الوحي" },
    { name: "Belief (Faith)", nameArabic: "الإيمان" },
    { name: "Knowledge", nameArabic: "العلم" },
    { name: "Ablutions (Wudu')", nameArabic: "الوضوء" },
    { name: "Bathing (Ghusl)", nameArabic: "الغسل" },
    { name: "Menstrual Periods", nameArabic: "الحيض" },
    { name: "Tayammum", nameArabic: "التيمم" },
    { name: "Prayers (Salat)", nameArabic: "الصلاة" },
    { name: "Times of the Prayers", nameArabic: "مواقيت الصلاة" },
    { name: "Call to Prayers (Adhan)", nameArabic: "الأذان" },
  ],
  muslim: [
    { name: "The Book of Faith", nameArabic: "كتاب الإيمان" },
    { name: "The Book of Purification", nameArabic: "كتاب الطهارة" },
    { name: "The Book of Menstruation", nameArabic: "كتاب الحيض" },
    { name: "The Book of Prayers", nameArabic: "كتاب الصلاة" },
    { name: "The Book of Mosques", nameArabic: "كتاب المساجد" },
    { name: "The Book of Prayer - Travelers", nameArabic: "صلاة المسافرين" },
    { name: "The Book of Friday Prayer", nameArabic: "كتاب الجمعة" },
    { name: "The Book of the Two Eids", nameArabic: "صلاة العيدين" },
    { name: "The Book of Prayer for Rain", nameArabic: "صلاة الاستسقاء" },
    { name: "The Book of Eclipses", nameArabic: "كتاب الكسوف" },
  ],
  tirmidhi: [
    { name: "Purification", nameArabic: "الطهارة" },
    { name: "The Prayer", nameArabic: "الصلاة" },
    { name: "The Book on Friday Prayer", nameArabic: "الجمعة" },
    { name: "The Book on Zakat", nameArabic: "الزكاة" },
    { name: "The Book on Fasting", nameArabic: "الصوم" },
    { name: "The Book on Hajj", nameArabic: "الحج" },
    { name: "The Book on Funerals", nameArabic: "الجنائز" },
    { name: "The Book on Marriage", nameArabic: "النكاح" },
    { name: "The Book on Suckling", nameArabic: "الرضاع" },
    { name: "The Book on Divorce", nameArabic: "الطلاق" },
  ],
  abudawud: [
    { name: "Purification (Kitab Al-Taharah)", nameArabic: "كتاب الطهارة" },
    { name: "Prayer (Kitab Al-Salat)", nameArabic: "كتاب الصلاة" },
    { name: "Prayer (Kitab Al-Salat): Details", nameArabic: "تفريع أبواب الصلاة" },
    { name: "The Quran (Kitab Al-Quran)", nameArabic: "كتاب القرآن" },
    { name: "Prayer (Kitab Al-Witr)", nameArabic: "كتاب الوتر" },
    { name: "Voluntary Prayers (Kitab Al-Tatawwu')", nameArabic: "كتاب التطوع" },
    { name: "Prayer During Journey", nameArabic: "صلاة السفر" },
    { name: "The Book of Fasting", nameArabic: "كتاب الصوم" },
    { name: "Jihad (Kitab Al-Jihad)", nameArabic: "كتاب الجهاد" },
    { name: "Sacrifice (Kitab Al-Dahaya)", nameArabic: "كتاب الضحايا" },
  ],
  nasai: [
    { name: "The Book of Purification", nameArabic: "كتاب الطهارة" },
    { name: "The Book of Water", nameArabic: "كتاب المياه" },
    { name: "The Book of Menstruation", nameArabic: "كتاب الحيض" },
    { name: "The Book of Ghusl", nameArabic: "كتاب الغسل" },
    { name: "The Book of Tayammum", nameArabic: "كتاب التيمم" },
    { name: "The Book of Prayer", nameArabic: "كتاب الصلاة" },
    { name: "The Book of the Times of Prayer", nameArabic: "كتاب المواقيت" },
    { name: "The Book of the Adhan", nameArabic: "كتاب الأذان" },
    { name: "The Book of the Masjid", nameArabic: "كتاب المساجد" },
    { name: "The Book of the Qiblah", nameArabic: "كتاب القبلة" },
  ],
  ibnmajah: [
    { name: "The Book of Purification", nameArabic: "كتاب الطهارة" },
    { name: "The Chapters on Prayer", nameArabic: "إقامة الصلاة والسنة فيها" },
    { name: "The Chapters on the Adhan", nameArabic: "كتاب الأذان" },
    { name: "The Chapters on the Mosques", nameArabic: "كتاب المساجد" },
    { name: "Establishing the Prayer", nameArabic: "إقامة الصلاة" },
    { name: "The Chapters on Funerals", nameArabic: "كتاب الجنائز" },
    { name: "The Chapters on Fasting", nameArabic: "كتاب الصيام" },
    { name: "The Chapters on Zakat", nameArabic: "كتاب الزكاة" },
    { name: "The Chapters on Marriage", nameArabic: "كتاب النكاح" },
    { name: "The Chapters on Divorce", nameArabic: "كتاب الطلاق" },
  ],
};

/**
 * Get books for a collection (local data)
 */
function getMockBooks(collectionId: string): HadithBook[] {
  const collection = HADITH_COLLECTIONS.find((c) => c.id === collectionId);
  if (!collection) return [];

  const bookNames = BOOK_NAMES[collectionId] || [];
  const bookCount = Math.min(collection.totalBooks, 10);
  const books: HadithBook[] = [];

  for (let i = 0; i < bookCount; i++) {
    const bookInfo = bookNames[i] || { name: `Book ${i + 1}`, nameArabic: `كتاب ${i + 1}` };
    books.push({
      bookNumber: i + 1,
      name: bookInfo.name,
      nameArabic: bookInfo.nameArabic,
      hadithCount: Math.floor(50 + Math.random() * 100), // 50-150 hadiths per book
      hadithStartNumber: i * 100 + 1,
      hadithEndNumber: (i + 1) * 100,
    });
  }

  return books;
}

/**
 * Get collection statistics
 */
export function getCollectionStats(collectionId: string): HadithCollection | null {
  return HADITH_COLLECTIONS.find((c) => c.id === collectionId) || null;
}

/**
 * Format hadith reference for display
 */
export function formatHadithReference(collectionId: string, hadithNumber: number): string {
  const collection = HADITH_COLLECTIONS.find((c) => c.id === collectionId);
  if (!collection) return `Hadith ${hadithNumber}`;
  
  return `${collection.name} ${hadithNumber}`;
}
