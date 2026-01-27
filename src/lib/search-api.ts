/**
 * Search API Utilities
 * 
 * Provides unified search functionality across Quran and Hadith content.
 * Uses client-side search with pre-loaded data for fast results.
 * Also queries the Quran API for comprehensive search.
 */

import {
  SearchResult,
  QuranSearchResult,
  HadithSearchResult,
  SearchResponse,
  SearchParams,
  SearchFilter,
  RecentSearch,
} from "@/types/search";
import { SURAH_LIST } from "@/types/quran";
import { HADITH_COLLECTIONS } from "@/types/hadith";
import { searchAllHadiths as searchLocalHadiths } from "@/data/hadiths";

// ============================================
// LOCAL STORAGE KEYS
// ============================================
const RECENT_SEARCHES_KEY = "noor-ul-ilm-recent-searches";
const MAX_RECENT_SEARCHES = 10;

// ============================================
// QURAN API SEARCH
// ============================================

/**
 * Search Quran verses using the Al-Quran Cloud API
 * This provides comprehensive search across all verses
 */
async function searchQuranAPI(query: string): Promise<QuranSearchResult[]> {
  if (!query.trim() || query.length < 2) return [];
  
  try {
    // Search in English translation
    const response = await fetch(
      `https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/en.sahih`
    );
    
    if (!response.ok) {
      console.warn("Quran API search failed:", response.status);
      return [];
    }
    
    const data = await response.json();
    
    if (data.code !== 200 || !data.data?.matches) {
      return [];
    }
    
    const results: QuranSearchResult[] = data.data.matches.map((match: {
      surah: { number: number; englishName: string; name: string };
      numberInSurah: number;
      text: string;
    }, index: number) => {
      const surahInfo = SURAH_LIST.find(s => s.number === match.surah.number);
      return {
        type: "quran" as const,
        id: `quran-api-${match.surah.number}-${match.numberInSurah}-${index}`,
        surahNumber: match.surah.number,
        surahName: match.surah.englishName,
        surahNameArabic: match.surah.name,
        ayahNumber: match.numberInSurah,
        arabicText: "", // API search returns translation only
        translationText: match.text,
        translationSource: "Sahih International",
        score: 80,
        snippet: generateSnippet(match.text, query),
      };
    });
    
    return results.slice(0, 50); // Limit to 50 results
  } catch (error) {
    console.error("Error searching Quran API:", error);
    return [];
  }
}

// ============================================
// SEARCH DATA - Sample verses and hadiths for search
// These are used for fallback when API is unavailable
// ============================================

/**
 * Sample Quran verses for search (famous verses with translations)
 * In production, this would be fetched from the Quran API
 */
const QURAN_SEARCH_DATA: Omit<QuranSearchResult, "id" | "score" | "snippet">[] = [
  {
    type: "quran",
    surahNumber: 1,
    surahName: "Al-Fatiha",
    surahNameArabic: "الفاتحة",
    ayahNumber: 1,
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translationText: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    translationSource: "Sahih International",
  },
  {
    type: "quran",
    surahNumber: 1,
    surahName: "Al-Fatiha",
    surahNameArabic: "الفاتحة",
    ayahNumber: 2,
    arabicText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translationText: "All praise is due to Allah, Lord of the worlds.",
    translationSource: "Sahih International",
  },
  {
    type: "quran",
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    ayahNumber: 255,
    arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    translationText: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.",
    translationSource: "Sahih International",
  },
  {
    type: "quran",
    surahNumber: 2,
    surahName: "Al-Baqarah",
    surahNameArabic: "البقرة",
    ayahNumber: 286,
    arabicText: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translationText: "Allah does not burden a soul beyond that it can bear.",
    translationSource: "Sahih International",
  },
  {
    type: "quran",
    surahNumber: 3,
    surahName: "Ali 'Imran",
    surahNameArabic: "آل عمران",
    ayahNumber: 139,
    arabicText: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    translationText: "So do not weaken and do not grieve, and you will be superior if you are believers.",
    translationSource: "Sahih International",
  },
  {
    type: "quran",
    surahNumber: 94,
    surahName: "Ash-Sharh",
    surahNameArabic: "الشرح",
    ayahNumber: 5,
    arabicText: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translationText: "For indeed, with hardship comes ease.",
    translationSource: "Sahih International",
  },
  {
    type: "quran",
    surahNumber: 94,
    surahName: "Ash-Sharh",
    surahNameArabic: "الشرح",
    ayahNumber: 6,
    arabicText: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translationText: "Indeed, with hardship comes ease.",
    translationSource: "Sahih International",
  },
  {
    type: "quran",
    surahNumber: 112,
    surahName: "Al-Ikhlas",
    surahNameArabic: "الإخلاص",
    ayahNumber: 1,
    arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    translationText: "Say, 'He is Allah, the One.'",
    translationSource: "Sahih International",
  },
  {
    type: "quran",
    surahNumber: 113,
    surahName: "Al-Falaq",
    surahNameArabic: "الفلق",
    ayahNumber: 1,
    arabicText: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    translationText: "Say, 'I seek refuge in the Lord of daybreak.'",
    translationSource: "Sahih International",
  },
  {
    type: "quran",
    surahNumber: 114,
    surahName: "An-Nas",
    surahNameArabic: "الناس",
    ayahNumber: 1,
    arabicText: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    translationText: "Say, 'I seek refuge in the Lord of mankind.'",
    translationSource: "Sahih International",
  },
  {
    type: "quran",
    surahNumber: 49,
    surahName: "Al-Hujurat",
    surahNameArabic: "الحجرات",
    ayahNumber: 13,
    arabicText: "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا",
    translationText: "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another.",
    translationSource: "Sahih International",
  },
  {
    type: "quran",
    surahNumber: 55,
    surahName: "Ar-Rahman",
    surahNameArabic: "الرحمن",
    ayahNumber: 13,
    arabicText: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    translationText: "So which of the favors of your Lord would you deny?",
    translationSource: "Sahih International",
  },
];

/**
 * Sample Hadith for search (famous hadiths)
 * In production, this would be fetched from the Hadith API
 */
const HADITH_SEARCH_DATA: Omit<HadithSearchResult, "id" | "score" | "snippet">[] = [
  {
    type: "hadith",
    collectionId: "bukhari",
    collectionName: "Sahih al-Bukhari",
    bookNumber: 1,
    hadithNumber: 1,
    arabicText: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    englishText: "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.",
    grade: "Sahih",
    narrator: "Umar bin Al-Khattab",
  },
  {
    type: "hadith",
    collectionId: "bukhari",
    collectionName: "Sahih al-Bukhari",
    bookNumber: 2,
    hadithNumber: 8,
    arabicText: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ",
    englishText: "Islam is based on five pillars: to testify that there is no god but Allah and Muhammad is His messenger, to establish prayer, to give zakat, to perform Hajj, and to fast in Ramadan.",
    grade: "Sahih",
    narrator: "Ibn Umar",
  },
  {
    type: "hadith",
    collectionId: "muslim",
    collectionName: "Sahih Muslim",
    bookNumber: 1,
    hadithNumber: 45,
    arabicText: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    englishText: "None of you truly believes until he loves for his brother what he loves for himself.",
    grade: "Sahih",
    narrator: "Anas bin Malik",
  },
  {
    type: "hadith",
    collectionId: "bukhari",
    collectionName: "Sahih al-Bukhari",
    bookNumber: 78,
    hadithNumber: 6018,
    arabicText: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    englishText: "Whoever believes in Allah and the Last Day should speak good or keep silent.",
    grade: "Sahih",
    narrator: "Abu Hurairah",
  },
  {
    type: "hadith",
    collectionId: "muslim",
    collectionName: "Sahih Muslim",
    bookNumber: 32,
    hadithNumber: 6219,
    arabicText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    englishText: "A Muslim is one from whose tongue and hands other Muslims are safe.",
    grade: "Sahih",
    narrator: "Abdullah bin Amr",
  },
  {
    type: "hadith",
    collectionId: "tirmidhi",
    collectionName: "Jami` at-Tirmidhi",
    bookNumber: 27,
    hadithNumber: 2004,
    arabicText: "خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ وَأَنَا خَيْرُكُمْ لِأَهْلِي",
    englishText: "The best of you is the one who is best to his family, and I am the best of you to my family.",
    grade: "Sahih",
    narrator: "Aisha",
  },
  {
    type: "hadith",
    collectionId: "muslim",
    collectionName: "Sahih Muslim",
    bookNumber: 45,
    hadithNumber: 2564,
    arabicText: "إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ وَأَعْمَالِكُمْ",
    englishText: "Allah does not look at your bodies or your forms, but He looks at your hearts and your deeds.",
    grade: "Sahih",
    narrator: "Abu Hurairah",
  },
  {
    type: "hadith",
    collectionId: "bukhari",
    collectionName: "Sahih al-Bukhari",
    bookNumber: 73,
    hadithNumber: 6114,
    arabicText: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
    englishText: "The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.",
    grade: "Sahih",
    narrator: "Abu Hurairah",
  },
  {
    type: "hadith",
    collectionId: "muslim",
    collectionName: "Sahih Muslim",
    bookNumber: 1,
    hadithNumber: 55,
    arabicText: "الدِّينُ النَّصِيحَةُ",
    englishText: "The religion is sincerity and sincere advice.",
    grade: "Sahih",
    narrator: "Tamim Al-Dari",
  },
  {
    type: "hadith",
    collectionId: "bukhari",
    collectionName: "Sahih al-Bukhari",
    bookNumber: 2,
    hadithNumber: 13,
    arabicText: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ",
    englishText: "Whoever believes in Allah and the Last Day should honor his guest.",
    grade: "Sahih",
    narrator: "Abu Hurairah",
  },
];

// ============================================
// SEARCH FUNCTIONS
// ============================================

/**
 * Calculate relevance score for a match
 */
function calculateScore(query: string, text: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();
  
  // Exact match gets highest score
  if (lowerText === lowerQuery) return 100;
  
  // Contains query as whole word
  const wordRegex = new RegExp(`\\b${escapeRegex(lowerQuery)}\\b`, "i");
  if (wordRegex.test(lowerText)) return 80;
  
  // Starts with query
  if (lowerText.startsWith(lowerQuery)) return 70;
  
  // Contains query
  if (lowerText.includes(lowerQuery)) return 50;
  
  // Fuzzy match - check if all words in query exist
  const queryWords = lowerQuery.split(/\s+/);
  const matchedWords = queryWords.filter((word) => lowerText.includes(word));
  return (matchedWords.length / queryWords.length) * 40;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Generate highlighted snippet
 */
function generateSnippet(text: string, query: string, maxLength: number = 200): string {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) {
    // Query not found directly, return start of text
    return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
  }
  
  // Calculate start and end for snippet
  const snippetStart = Math.max(0, index - 50);
  const snippetEnd = Math.min(text.length, index + query.length + 100);
  
  let snippet = "";
  if (snippetStart > 0) snippet += "...";
  snippet += text.slice(snippetStart, snippetEnd);
  if (snippetEnd < text.length) snippet += "...";
  
  return snippet;
}

/**
 * Search Quran content
 */
function searchQuran(query: string): QuranSearchResult[] {
  if (!query.trim()) return [];
  
  const results: QuranSearchResult[] = [];
  
  for (const verse of QURAN_SEARCH_DATA) {
    // Search in Arabic and translation
    const arabicScore = calculateScore(query, verse.arabicText);
    const translationScore = calculateScore(query, verse.translationText);
    const surahNameScore = calculateScore(query, verse.surahName);
    
    const maxScore = Math.max(arabicScore, translationScore, surahNameScore);
    
    if (maxScore > 20) {
      results.push({
        ...verse,
        id: `quran-${verse.surahNumber}-${verse.ayahNumber}`,
        score: maxScore,
        snippet: generateSnippet(verse.translationText, query),
      });
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Search Hadith content using local data
 */
function searchHadith(query: string): HadithSearchResult[] {
  if (!query.trim()) return [];
  
  const results: HadithSearchResult[] = [];
  
  // Search in local hadith database first
  const localResults = searchLocalHadiths(query);
  
  for (const hadith of localResults) {
    const collectionInfo = HADITH_COLLECTIONS.find(c => 
      hadith.reference?.toLowerCase().startsWith(c.id.toLowerCase())
    );
    
    results.push({
      type: "hadith",
      id: `hadith-local-${hadith.reference || hadith.hadithNumber}`,
      collectionId: collectionInfo?.id || "bukhari",
      collectionName: collectionInfo?.name || "Sahih al-Bukhari",
      bookNumber: hadith.bookNumber || 1,
      hadithNumber: hadith.hadithNumber,
      arabicText: hadith.arabicText,
      englishText: hadith.englishText,
      grade: hadith.grade,
      narrator: hadith.primaryNarrator,
      score: 75,
      snippet: generateSnippet(hadith.englishText, query),
    });
  }
  
  // Also search the static data for additional results
  for (const hadith of HADITH_SEARCH_DATA) {
    // Search in Arabic and English
    const arabicScore = calculateScore(query, hadith.arabicText);
    const englishScore = calculateScore(query, hadith.englishText);
    const narratorScore = hadith.narrator ? calculateScore(query, hadith.narrator) : 0;
    
    const maxScore = Math.max(arabicScore, englishScore, narratorScore);
    
    if (maxScore > 20) {
      // Avoid duplicates
      const isDuplicate = results.some(r => 
        r.hadithNumber === hadith.hadithNumber && r.collectionId === hadith.collectionId
      );
      if (!isDuplicate) {
        results.push({
          ...hadith,
          id: `hadith-${hadith.collectionId}-${hadith.hadithNumber}`,
          score: maxScore,
          snippet: generateSnippet(hadith.englishText, query),
        });
      }
    }
  }
  
  return results.sort((a, b) => b.score - a.score);
}

/**
 * Main search function - searches both Quran and Hadith
 * Uses API for Quran search to get comprehensive results
 */
export async function search(params: SearchParams): Promise<SearchResponse> {
  const {
    query,
    filter = "all",
    page = 1,
    limit = 20,
  } = params;
  
  if (!query.trim()) {
    return {
      results: [],
      total: 0,
      page,
      limit,
      hasMore: false,
      query,
      filter,
    };
  }
  
  let results: SearchResult[] = [];
  
  // Search based on filter
  if (filter === "all" || filter === "quran") {
    // First try API search for comprehensive results
    const apiResults = await searchQuranAPI(query);
    if (apiResults.length > 0) {
      results = [...results, ...apiResults];
    }
    // Also add local static data results
    results = [...results, ...searchQuran(query)];
  }
  
  if (filter === "all" || filter === "hadith") {
    results = [...results, ...searchHadith(query)];
  }
  
  // Remove duplicates (by id)
  const seen = new Set<string>();
  results = results.filter(r => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });
  
  // Sort by score
  results.sort((a, b) => b.score - a.score);
  
  // Paginate
  const startIndex = (page - 1) * limit;
  const paginatedResults = results.slice(startIndex, startIndex + limit);
  
  return {
    results: paginatedResults,
    total: results.length,
    page,
    limit,
    hasMore: startIndex + limit < results.length,
    query,
    filter,
  };
}

// ============================================
// RECENT SEARCHES
// ============================================

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(): RecentSearch[] {
  if (typeof window === "undefined") return [];
  
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Save a search to recent searches
 */
export function saveRecentSearch(query: string, resultCount: number): void {
  if (typeof window === "undefined" || !query.trim()) return;
  
  try {
    const recent = getRecentSearches();
    
    // Remove duplicate if exists
    const filtered = recent.filter((s) => s.query.toLowerCase() !== query.toLowerCase());
    
    // Add new search at beginning
    const updated: RecentSearch[] = [
      { query, timestamp: Date.now(), resultCount },
      ...filtered,
    ].slice(0, MAX_RECENT_SEARCHES);
    
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clear recent searches
 */
export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Ignore storage errors
  }
}

// ============================================
// SEARCH SUGGESTIONS
// ============================================

/**
 * Popular search terms
 */
const POPULAR_SEARCHES = [
  "Allah",
  "mercy",
  "prayer",
  "patience",
  "Fatiha",
  "intentions",
  "belief",
  "Ayatul Kursi",
  "hardship",
  "forgiveness",
];

/**
 * Get search suggestions based on query
 */
export function getSearchSuggestions(query: string): string[] {
  if (!query.trim()) {
    // Return popular searches
    return POPULAR_SEARCHES.slice(0, 5);
  }
  
  const lowerQuery = query.toLowerCase();
  
  // Combine popular searches with recent
  const recent = getRecentSearches().map((s) => s.query);
  const allSuggestions = [...new Set([...recent, ...POPULAR_SEARCHES])];
  
  // Filter by query
  return allSuggestions
    .filter((s) => s.toLowerCase().includes(lowerQuery) && s.toLowerCase() !== lowerQuery)
    .slice(0, 5);
}
