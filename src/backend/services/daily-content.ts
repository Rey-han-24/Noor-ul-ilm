/**
 * Daily Content Data & Utilities
 * 
 * Contains curated verses and hadiths that rotate daily.
 * Uses date-based seeding to ensure the same content shows all day,
 * but changes to a new random selection each new day.
 */

/**
 * Curated Quran verses for "Verse of the Day"
 * All verses are authentic and verified
 */
export const DAILY_VERSES = [
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship comes ease.",
    reference: "Surah Ash-Sharh (94:6)",
  },
  {
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation: "And whoever puts their trust in Allah, He is sufficient for them.",
    reference: "Surah At-Talaq (65:3)",
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    translation: "So remember Me; I will remember you.",
    reference: "Surah Al-Baqarah (2:152)",
  },
  {
    arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    translation: "And say: My Lord, increase me in knowledge.",
    reference: "Surah Ta-Ha (20:114)",
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "Indeed, Allah is with the patient.",
    reference: "Surah Al-Baqarah (2:153)",
  },
  {
    arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ",
    translation: "And do not despair of the mercy of Allah.",
    reference: "Surah Yusuf (12:87)",
  },
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    translation: "Our Lord, give us good in this world and good in the Hereafter.",
    reference: "Surah Al-Baqarah (2:201)",
  },
  {
    arabic: "وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ",
    translation: "And Allah loves those who do good.",
    reference: "Surah Al-Imran (3:134)",
  },
  {
    arabic: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ",
    translation: "Indeed, the mercy of Allah is near to those who do good.",
    reference: "Surah Al-A'raf (7:56)",
  },
  {
    arabic: "وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ",
    translation: "Whatever good you send forth for yourselves, you will find it with Allah.",
    reference: "Surah Al-Baqarah (2:110)",
  },
];

/**
 * Curated Hadiths for "Hadith of the Day"
 * All hadiths are from authentic collections with proper grading
 */
export const DAILY_HADITHS = [
  {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    translation: "Actions are judged by intentions.",
    source: "Sahih al-Bukhari",
    hadithNumber: "1",
    narrator: "Umar ibn Al-Khattab (RA)",
  },
  {
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    translation: "The best among you are those who learn the Quran and teach it.",
    source: "Sahih al-Bukhari",
    hadithNumber: "5027",
    narrator: "Uthman ibn Affan (RA)",
  },
  {
    arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    translation: "A Muslim is one from whose tongue and hand other Muslims are safe.",
    source: "Sahih al-Bukhari",
    hadithNumber: "10",
    narrator: "Abdullah ibn Amr (RA)",
  },
  {
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    translation: "None of you truly believes until he loves for his brother what he loves for himself.",
    source: "Sahih al-Bukhari",
    hadithNumber: "13",
    narrator: "Anas ibn Malik (RA)",
  },
  {
    arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    translation: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
    source: "Sahih al-Bukhari",
    hadithNumber: "6018",
    narrator: "Abu Hurairah (RA)",
  },
  {
    arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ",
    translation: "Cleanliness is half of faith.",
    source: "Sahih Muslim",
    hadithNumber: "223",
    narrator: "Abu Malik al-Ash'ari (RA)",
  },
  {
    arabic: "الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ",
    translation: "The world is a prison for the believer and a paradise for the disbeliever.",
    source: "Sahih Muslim",
    hadithNumber: "2956",
    narrator: "Abu Hurairah (RA)",
  },
  {
    arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ صَدَقَةٌ",
    translation: "Your smile for your brother is a charity.",
    source: "Jami at-Tirmidhi",
    hadithNumber: "1956",
    narrator: "Abu Dharr (RA)",
  },
  {
    arabic: "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    translation: "A good word is charity.",
    source: "Sahih al-Bukhari",
    hadithNumber: "2989",
    narrator: "Abu Hurairah (RA)",
  },
  {
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ",
    translation: "Whoever takes a path seeking knowledge, Allah will make easy for him a path to Paradise.",
    source: "Sahih Muslim",
    hadithNumber: "2699",
    narrator: "Abu Hurairah (RA)",
  },
];

/**
 * Get a deterministic random index based on the current date
 * This ensures the same content shows all day, but changes daily
 * 
 * @param arrayLength - Length of the array to get index for
 * @param offset - Optional offset to get different items for verse vs hadith
 * @returns Index for the array
 */
function getDailyIndex(arrayLength: number, offset: number = 0): number {
  const today = new Date();
  // Create a seed from the date (YYYYMMDD format)
  const seed = today.getFullYear() * 10000 + 
               (today.getMonth() + 1) * 100 + 
               today.getDate() + 
               offset;
  
  // Simple hash function to get a pseudo-random number
  return seed % arrayLength;
}

/**
 * Get today's verse of the day
 * @returns The verse object for today
 */
export function getDailyVerse() {
  const index = getDailyIndex(DAILY_VERSES.length, 0);
  return DAILY_VERSES[index];
}

/**
 * Get today's hadith of the day
 * @returns The hadith object for today
 */
export function getDailyHadith() {
  const index = getDailyIndex(DAILY_HADITHS.length, 100); // Offset to get different randomization
  return DAILY_HADITHS[index];
}
