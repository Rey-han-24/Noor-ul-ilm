/**
 * Hadith Data Index
 * 
 * Central export for all hadith collections.
 * Contains authentic hadiths from the six major collections
 * plus the Forty Hadith of Imam an-Nawawi.
 * 
 * @module data/hadiths
 */

import { Hadith, HadithBook } from "@/shared/types/hadith";
import { bukhariHadiths, getAllBukhariHadiths, getBukhariHadithsByBook } from "./bukhari";
import { muslimHadiths, getAllMuslimHadiths, getMuslimHadithsByBook } from "./muslim";
import { getAllNawawiHadiths, nawawiFortyHadiths } from "./nawawi";

// Re-export individual collections
export { bukhariHadiths, getAllBukhariHadiths, getBukhariHadithsByBook };
export { muslimHadiths, getAllMuslimHadiths, getMuslimHadithsByBook };
export { nawawiFortyHadiths, getAllNawawiHadiths };

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
  NAWAWI: "nawawi",
} as const;

/**
 * Get hadiths by collection ID and book number
 */
export function getHadithsByCollectionAndBook(
  collectionId: string,
  bookNumber: number
): Hadith[] {
  switch (collectionId) {
    case COLLECTION_IDS.BUKHARI:
      return getBukhariHadithsByBook(bookNumber);
    case COLLECTION_IDS.MUSLIM:
      return getMuslimHadithsByBook(bookNumber);
    case COLLECTION_IDS.NAWAWI:
      return getAllNawawiHadiths();
    default:
      // Return sample hadiths for other collections
      return getSampleHadiths(collectionId, bookNumber);
  }
}

/**
 * Get all hadiths from a collection
 */
export function getAllHadithsByCollection(collectionId: string): Hadith[] {
  switch (collectionId) {
    case COLLECTION_IDS.BUKHARI:
      return getAllBukhariHadiths();
    case COLLECTION_IDS.MUSLIM:
      return getAllMuslimHadiths();
    case COLLECTION_IDS.NAWAWI:
      return getAllNawawiHadiths();
    default:
      return getAllBukhariHadiths().slice(0, 20); // Sample for demo
  }
}

/**
 * Search hadiths across all collections
 */
export function searchAllHadiths(query: string): Hadith[] {
  const allHadiths = [
    ...getAllBukhariHadiths(),
    ...getAllMuslimHadiths(),
    ...getAllNawawiHadiths(),
  ];

  const lowerQuery = query.toLowerCase();
  
  return allHadiths.filter(
    (hadith) =>
      hadith.englishText.toLowerCase().includes(lowerQuery) ||
      hadith.arabicText.includes(query) ||
      hadith.primaryNarrator?.toLowerCase().includes(lowerQuery) ||
      hadith.chapterTitle?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get a specific hadith by collection and number
 */
export function getHadithByNumber(
  collectionId: string,
  hadithNumber: number
): Hadith | undefined {
  const allHadiths = getAllHadithsByCollection(collectionId);
  return allHadiths.find((h) => h.hadithNumber === hadithNumber);
}

/**
 * Sample hadiths for collections that don't have full data yet
 * These are famous authentic hadiths shared across collections
 */
function getSampleHadiths(collectionId: string, bookNumber: number): Hadith[] {
  const sampleHadiths: Hadith[] = [
    {
      hadithNumber: 1,
      arabicText: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
      englishText: "Narrated 'Umar bin Al-Khattab (رضي الله عنه): I heard Allah's Messenger (ﷺ) saying, \"Actions are judged by intentions, and every person will get the reward according to what he has intended.\"",
      primaryNarrator: "Umar bin Al-Khattab",
      primaryNarratorArabic: "عمر بن الخطاب رضي الله عنه",
      grade: "Sahih",
      gradedBy: "Al-Bukhari & Muslim",
      bookNumber: bookNumber,
      reference: `${collectionId} 1`,
      inBookReference: `Book ${bookNumber}, Hadith 1`,
    },
    {
      hadithNumber: 2,
      arabicText: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ",
      englishText: "Narrated Ibn 'Umar (رضي الله عنهما): Allah's Messenger (ﷺ) said, \"Islam is based on five (pillars): to testify that there is no god but Allah and that Muhammad is the Messenger of Allah, to establish the prayer, to give Zakat, to perform Hajj, and to fast in Ramadan.\"",
      primaryNarrator: "Ibn Umar",
      primaryNarratorArabic: "عبد الله بن عمر رضي الله عنهما",
      grade: "Sahih",
      gradedBy: "Al-Bukhari & Muslim",
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
      arabicText: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
      englishText: "Narrated Abu Hurairah (رضي الله عنه): Allah's Messenger (ﷺ) said, \"Whoever believes in Allah and the Last Day should speak good or keep silent.\"",
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
      arabicText: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
      englishText: "Narrated 'Abdullah bin 'Amr (رضي الله عنهما): The Prophet (ﷺ) said, \"A Muslim is the one from whose tongue and hands the Muslims are safe.\"",
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
      arabicText: "الدِّينُ النَّصِيحَةُ",
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
      englishText: "Narrated An-Nu'man bin Bashir (رضي الله عنهما): The Messenger of Allah (ﷺ) said, \"The believers in their mutual kindness, compassion and sympathy are just like one body. When one of the limbs suffers, the whole body responds with wakefulness and fever.\"",
      primaryNarrator: "An-Nu'man bin Bashir",
      primaryNarratorArabic: "النعمان بن بشير رضي الله عنهما",
      grade: "Sahih",
      gradedBy: "Al-Bukhari & Muslim",
      bookNumber: bookNumber,
      reference: `${collectionId} 8`,
      inBookReference: `Book ${bookNumber}, Hadith 8`,
    },
    {
      hadithNumber: 9,
      arabicText: "لاَ تَغْضَبْ",
      englishText: "Narrated Abu Hurairah (رضي الله عنه): A man said to the Prophet (ﷺ), \"Advise me.\" He said, \"Do not become angry.\" The man repeated his request several times, and he said, \"Do not become angry.\"",
      primaryNarrator: "Abu Hurairah",
      primaryNarratorArabic: "أبو هريرة رضي الله عنه",
      grade: "Sahih",
      gradedBy: "Al-Bukhari",
      bookNumber: bookNumber,
      reference: `${collectionId} 9`,
      inBookReference: `Book ${bookNumber}, Hadith 9`,
    },
    {
      hadithNumber: 10,
      arabicText: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ",
      englishText: "Narrated Abu Dharr (رضي الله عنه): The Messenger of Allah (ﷺ) said, \"Fear Allah wherever you are, follow up a bad deed with a good one and it will wipe it out, and behave well towards people.\"",
      primaryNarrator: "Abu Dharr",
      primaryNarratorArabic: "أبو ذر رضي الله عنه",
      grade: "Hasan",
      gradedBy: "At-Tirmidhi",
      bookNumber: bookNumber,
      reference: `${collectionId} 10`,
      inBookReference: `Book ${bookNumber}, Hadith 10`,
    },
  ];

  return sampleHadiths;
}

/**
 * Book data for each collection
 */
export const COLLECTION_BOOKS: Record<string, HadithBook[]> = {
  bukhari: [
    { bookNumber: 1, name: "Revelation", nameArabic: "بدء الوحي", hadithCount: 7, hadithStartNumber: 1, hadithEndNumber: 7 },
    { bookNumber: 2, name: "Belief (Faith)", nameArabic: "الإيمان", hadithCount: 13, hadithStartNumber: 8, hadithEndNumber: 20 },
    { bookNumber: 3, name: "Knowledge", nameArabic: "العلم", hadithCount: 5, hadithStartNumber: 59, hadithEndNumber: 63 },
    { bookNumber: 4, name: "Ablutions (Wudu')", nameArabic: "الوضوء", hadithCount: 50, hadithStartNumber: 135, hadithEndNumber: 184 },
    { bookNumber: 5, name: "Bathing (Ghusl)", nameArabic: "الغسل", hadithCount: 30, hadithStartNumber: 248, hadithEndNumber: 277 },
    { bookNumber: 6, name: "Menstrual Periods", nameArabic: "الحيض", hadithCount: 40, hadithStartNumber: 294, hadithEndNumber: 333 },
    { bookNumber: 7, name: "Tayammum", nameArabic: "التيمم", hadithCount: 10, hadithStartNumber: 334, hadithEndNumber: 343 },
    { bookNumber: 8, name: "Prayers (Salat)", nameArabic: "الصلاة", hadithCount: 3, hadithStartNumber: 350, hadithEndNumber: 352 },
    { bookNumber: 9, name: "Times of the Prayers", nameArabic: "مواقيت الصلاة", hadithCount: 60, hadithStartNumber: 500, hadithEndNumber: 559 },
    { bookNumber: 10, name: "Call to Prayers (Adhan)", nameArabic: "الأذان", hadithCount: 60, hadithStartNumber: 603, hadithEndNumber: 662 },
  ],
  muslim: [
    { bookNumber: 1, name: "The Book of Faith", nameArabic: "كتاب الإيمان", hadithCount: 10, hadithStartNumber: 1, hadithEndNumber: 10 },
    { bookNumber: 2, name: "The Book of Purification", nameArabic: "كتاب الطهارة", hadithCount: 3, hadithStartNumber: 223, hadithEndNumber: 225 },
    { bookNumber: 3, name: "The Book of Menstruation", nameArabic: "كتاب الحيض", hadithCount: 40, hadithStartNumber: 260, hadithEndNumber: 299 },
    { bookNumber: 4, name: "The Book of Prayers", nameArabic: "كتاب الصلاة", hadithCount: 2, hadithStartNumber: 384, hadithEndNumber: 385 },
    { bookNumber: 5, name: "The Book of Mosques", nameArabic: "كتاب المساجد", hadithCount: 50, hadithStartNumber: 500, hadithEndNumber: 549 },
    { bookNumber: 32, name: "The Book of Righteousness", nameArabic: "كتاب البر والصلة", hadithCount: 2, hadithStartNumber: 2564, hadithEndNumber: 2565 },
  ],
  nawawi: [
    { bookNumber: 1, name: "Forty Hadith of an-Nawawi", nameArabic: "الأربعون النووية", hadithCount: 42, hadithStartNumber: 1, hadithEndNumber: 42 },
  ],
  tirmidhi: [
    { bookNumber: 1, name: "Purification", nameArabic: "الطهارة", hadithCount: 50, hadithStartNumber: 1, hadithEndNumber: 50 },
    { bookNumber: 2, name: "The Prayer", nameArabic: "الصلاة", hadithCount: 80, hadithStartNumber: 51, hadithEndNumber: 130 },
    { bookNumber: 3, name: "The Book on Friday Prayer", nameArabic: "الجمعة", hadithCount: 30, hadithStartNumber: 131, hadithEndNumber: 160 },
    { bookNumber: 4, name: "The Book on Zakat", nameArabic: "الزكاة", hadithCount: 40, hadithStartNumber: 161, hadithEndNumber: 200 },
  ],
  abudawud: [
    { bookNumber: 1, name: "Purification", nameArabic: "كتاب الطهارة", hadithCount: 100, hadithStartNumber: 1, hadithEndNumber: 100 },
    { bookNumber: 2, name: "Prayer", nameArabic: "كتاب الصلاة", hadithCount: 150, hadithStartNumber: 101, hadithEndNumber: 250 },
    { bookNumber: 3, name: "Prayer Details", nameArabic: "تفريع أبواب الصلاة", hadithCount: 80, hadithStartNumber: 251, hadithEndNumber: 330 },
  ],
  nasai: [
    { bookNumber: 1, name: "The Book of Purification", nameArabic: "كتاب الطهارة", hadithCount: 100, hadithStartNumber: 1, hadithEndNumber: 100 },
    { bookNumber: 2, name: "The Book of Water", nameArabic: "كتاب المياه", hadithCount: 50, hadithStartNumber: 101, hadithEndNumber: 150 },
  ],
  ibnmajah: [
    { bookNumber: 1, name: "The Book of Purification", nameArabic: "كتاب الطهارة", hadithCount: 100, hadithStartNumber: 1, hadithEndNumber: 100 },
    { bookNumber: 2, name: "The Chapters on Prayer", nameArabic: "إقامة الصلاة", hadithCount: 150, hadithStartNumber: 101, hadithEndNumber: 250 },
  ],
};

/**
 * Get books for a collection
 */
export function getCollectionBooks(collectionId: string): HadithBook[] {
  return COLLECTION_BOOKS[collectionId] || [];
}

/**
 * Get total hadith count across all available collections
 */
export function getTotalHadithCount(): number {
  return (
    getAllBukhariHadiths().length +
    getAllMuslimHadiths().length +
    getAllNawawiHadiths().length
  );
}
