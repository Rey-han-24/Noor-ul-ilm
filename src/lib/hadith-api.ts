/**
 * Hadith API Utilities
 * 
 * Provides Hadith data from curated local collections AND external CDN.
 * Contains authentic hadiths from Sahih al-Bukhari, Sahih Muslim,
 * and the Forty Hadith of Imam an-Nawawi.
 * 
 * Falls back to external CDN (fawazahmed0/hadith-api) when local data
 * is insufficient.
 */

import { 
  Hadith, 
  HadithBook, 
  HadithGrade, 
  HadithCollection,
  HADITH_COLLECTIONS 
} from "@/types/hadith";

import {
  getHadithsByCollectionAndBook,
  getAllHadithsByCollection,
  searchAllHadiths,
  getCollectionBooks as getLocalCollectionBooks,
  COLLECTION_BOOKS,
} from "@/data/hadiths";

import { fetchMinifiedCollection, fetchHadithByNumber } from "./hadith-external-api";

// Cache for external data
const externalHadithCache: Map<string, { data: Hadith[]; timestamp: number }> = new Map();
const CACHE_TTL = 3600000; // 1 hour

/**
 * Parse grade string to HadithGrade type
 */
function parseGrade(gradeString: string | undefined): HadithGrade {
  if (!gradeString) return "Unknown";
  
  const lower = gradeString.toLowerCase();
  if (lower.includes("sahih")) return "Sahih";
  if (lower.includes("hasan")) return "Hasan";
  if (lower.includes("da'if") || lower.includes("daif") || lower.includes("weak")) return "Da'if";
  if (lower.includes("mawdu") || lower.includes("fabricat")) return "Mawdu";
  
  return "Unknown";
}

/**
 * Get all books in a collection
 */
export async function getCollectionBooks(collectionId: string): Promise<HadithBook[]> {
  // Use local data for all collections
  const books = getLocalCollectionBooks(collectionId);
  if (books.length > 0) {
    return books;
  }
  
  // Fallback to generated books if no local data
  return getMockBooks(collectionId);
}

/**
 * Get hadiths from a specific book (uses local data + external CDN)
 */
export async function getBookHadiths(
  collectionId: string, 
  bookNumber: number,
  page: number = 1,
  limit: number = 50
): Promise<{ hadiths: Hadith[]; total: number; hasMore: boolean }> {
  // First try local data
  let hadiths = getHadithsByCollectionAndBook(collectionId, bookNumber);
  
  // If local data is empty or insufficient, try external
  if (hadiths.length < 5) {
    const cacheKey = `${collectionId}-all`;
    const cached = externalHadithCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      hadiths = cached.data.filter(h => h.bookNumber === bookNumber);
    } else {
      try {
        const externalHadiths = await fetchMinifiedCollection(collectionId);
        if (externalHadiths.length > 0) {
          externalHadithCache.set(cacheKey, { data: externalHadiths, timestamp: Date.now() });
          hadiths = externalHadiths.filter(h => h.bookNumber === bookNumber);
        }
      } catch (error) {
        console.error("Error fetching from external:", error);
      }
    }
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
 * Get a specific hadith by number (uses local data + external CDN)
 */
export async function getHadith(
  collectionId: string,
  hadithNumber: number
): Promise<Hadith | null> {
  // Try local first
  const allHadiths = getAllHadithsByCollection(collectionId);
  let hadith = allHadiths.find(h => h.hadithNumber === hadithNumber);
  
  // If not found locally, try external
  if (!hadith) {
    try {
      hadith = await fetchHadithByNumber(collectionId, hadithNumber) || undefined;
    } catch (error) {
      console.error("Error fetching hadith from external:", error);
    }
  }
  
  return hadith || null;
}

/**
 * Search hadiths across all collections
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

/**
 * Extract narrator name from hadith text
 */
function extractNarrator(text: string): string {
  // Common patterns: "Narrated Abu Hurairah:", "Abu Hurairah reported:"
  const patterns = [
    /^Narrated\s+([^:]+):/i,
    /^([^:]+)\s+reported:/i,
    /^([^:]+)\s+narrated:/i,
    /^It was narrated from\s+([^:]+)/i,
    /^It was narrated on the authority of\s+([^:]+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return "";
}

// ============================================
// LOCAL DATA FOR DEVELOPMENT
// (Used when Sunnah.com API key is not configured)
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
 * Get mock hadiths for development
 * Contains authentic, well-known hadiths for demonstration
 */
function getMockHadiths(
  collectionId: string, 
  bookNumber: number
): { hadiths: Hadith[]; total: number; hasMore: boolean } {
  // Famous authentic hadiths from Bukhari and Muslim
  const famousHadiths: Hadith[] = [
    {
      hadithNumber: 1,
      arabicText: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
      englishText: "Narrated 'Umar bin Al-Khattab (رضي الله عنه): I heard Allah's Messenger (ﷺ) saying, \"Actions are judged by intentions, and every person will get the reward according to what he has intended. So whoever emigrated for Allah and His Messenger, his emigration is for Allah and His Messenger. And whoever emigrated for worldly benefits or to marry a woman, his emigration is for what he emigrated for.\"",
      primaryNarrator: "Umar bin Al-Khattab",
      primaryNarratorArabic: "عمر بن الخطاب رضي الله عنه",
      grade: "Sahih",
      gradedBy: "Al-Bukhari",
      bookNumber: bookNumber,
      reference: `${collectionId} 1`,
      inBookReference: `Book ${bookNumber}, Hadith 1`,
    },
    {
      hadithNumber: 2,
      arabicText: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ",
      englishText: "Narrated Ibn 'Umar (رضي الله عنهما): Allah's Messenger (ﷺ) said, \"Islam is based on five (pillars): to testify that there is no god but Allah and that Muhammad is the Messenger of Allah, to establish the prayer, to give Zakat, to perform Hajj to the House (Ka'bah), and to fast in Ramadan.\"",
      primaryNarrator: "Ibn Umar",
      primaryNarratorArabic: "عبد الله بن عمر رضي الله عنهما",
      grade: "Sahih",
      gradedBy: "Al-Bukhari",
      bookNumber: bookNumber,
      reference: `${collectionId} 2`,
      inBookReference: `Book ${bookNumber}, Hadith 2`,
    },
    {
      hadithNumber: 3,
      arabicText: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
      englishText: "Narrated Anas bin Malik (رضي الله عنه): The Prophet (ﷺ) said, \"None of you will have true faith until he loves for his brother what he loves for himself.\"",
      primaryNarrator: "Anas bin Malik",
      primaryNarratorArabic: "أنس بن مالك رضي الله عنه",
      grade: "Sahih",
      gradedBy: "Al-Bukhari & Muslim",
      bookNumber: bookNumber,
      reference: `${collectionId} 3`,
      inBookReference: `Book ${bookNumber}, Hadith 3`,
    },
    {
      hadithNumber: 4,
      arabicText: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ",
      englishText: "Narrated Abu Hurairah (رضي الله عنه): Allah's Messenger (ﷺ) said, \"Whoever believes in Allah and the Last Day should speak good or keep silent. Whoever believes in Allah and the Last Day should honor his neighbor. Whoever believes in Allah and the Last Day should honor his guest.\"",
      primaryNarrator: "Abu Hurairah",
      primaryNarratorArabic: "أبو هريرة رضي الله عنه",
      grade: "Sahih",
      gradedBy: "Al-Bukhari & Muslim",
      bookNumber: bookNumber,
      reference: `${collectionId} 4`,
      inBookReference: `Book ${bookNumber}, Hadith 4`,
    },
    {
      hadithNumber: 5,
      arabicText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالْمُهَاجِرُ مَنْ هَجَرَ مَا نَهَى اللَّهُ عَنْهُ",
      englishText: "Narrated 'Abdullah bin 'Amr (رضي الله عنهما): The Prophet (ﷺ) said, \"A Muslim is the one from whose tongue and hands the Muslims are safe. And the emigrant (Muhajir) is the one who abandons what Allah has forbidden.\"",
      primaryNarrator: "Abdullah bin Amr",
      primaryNarratorArabic: "عبد الله بن عمرو رضي الله عنهما",
      grade: "Sahih",
      gradedBy: "Al-Bukhari",
      bookNumber: bookNumber,
      reference: `${collectionId} 5`,
      inBookReference: `Book ${bookNumber}, Hadith 5`,
    },
    {
      hadithNumber: 6,
      arabicText: "إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
      englishText: "Narrated Abu Hurairah (رضي الله عنه): The Messenger of Allah (ﷺ) said, \"Allah does not look at your bodies or your forms, but He looks at your hearts and your deeds.\"",
      primaryNarrator: "Abu Hurairah",
      primaryNarratorArabic: "أبو هريرة رضي الله عنه",
      grade: "Sahih",
      gradedBy: "Muslim",
      bookNumber: bookNumber,
      reference: `${collectionId} 6`,
      inBookReference: `Book ${bookNumber}, Hadith 6`,
    },
    {
      hadithNumber: 7,
      arabicText: "الدِّينُ النَّصِيحَةُ قُلْنَا لِمَنْ قَالَ لِلَّهِ وَلِكِتَابِهِ وَلِرَسُولِهِ وَلِأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ",
      englishText: "Narrated Tamim Al-Dari (رضي الله عنه): The Prophet (ﷺ) said, \"The religion is sincerity.\" We said, \"To whom?\" He replied, \"To Allah, His Book, His Messenger, the leaders of the Muslims, and their common people.\"",
      primaryNarrator: "Tamim Al-Dari",
      primaryNarratorArabic: "تميم الداري رضي الله عنه",
      grade: "Sahih",
      gradedBy: "Muslim",
      bookNumber: bookNumber,
      reference: `${collectionId} 7`,
      inBookReference: `Book ${bookNumber}, Hadith 7`,
    },
    {
      hadithNumber: 8,
      arabicText: "مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ مَثَلُ الْجَسَدِ إِذَا اشْتَكَى مِنْهُ عُضْوٌ تَدَاعَى لَهُ سَائِرُ الْجَسَدِ بِالسَّهَرِ وَالْحُمَّى",
      englishText: "Narrated An-Nu'man bin Bashir (رضي الله عنهما): The Messenger of Allah (ﷺ) said, \"The believers in their mutual kindness, compassion and sympathy are just like one body. When one of the limbs suffers, the whole body responds to it with wakefulness and fever.\"",
      primaryNarrator: "An-Nu'man bin Bashir",
      primaryNarratorArabic: "النعمان بن بشير رضي الله عنهما",
      grade: "Sahih",
      gradedBy: "Al-Bukhari & Muslim",
      bookNumber: bookNumber,
      reference: `${collectionId} 8`,
      inBookReference: `Book ${bookNumber}, Hadith 8`,
    },
  ];

  return {
    hadiths: famousHadiths,
    total: famousHadiths.length,
    hasMore: false,
  };
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
