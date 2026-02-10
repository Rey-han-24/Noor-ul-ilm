/**
 * Quran Audio API Service
 * 
 * Provides audio recitation URLs from the Islamic Network CDN.
 * FREE & unlimited usage with high-quality audio files.
 * 
 * CDN: https://cdn.islamic.network
 * 
 * Available Reciters:
 * - ar.alafasy (Mishary Rashid Alafasy)
 * - ar.abdulbasitmurattal (Abdul Basit - Murattal)
 * - ar.abdulsamad (Abdul Samad)
 * - ar.husary (Mahmoud Khalil Al-Husary)
 * - ar.minshawi (Mohamed Siddiq El-Minshawi)
 * - ar.muhammadayyoub (Muhammad Ayyub)
 * - ar.muhammadjibreel (Muhammad Jibreel)
 * - ar.shaatree (Abu Bakr al-Shatri)
 * - ar.hudhaify (Ali Al-Hudhaify)
 * 
 * @module backend/services/quran-audio
 */

/**
 * Available Quran reciters with their metadata
 */
export const QURAN_RECITERS = [
  {
    id: 'ar.alafasy',
    name: 'Mishary Rashid Alafasy',
    nameArabic: 'مشاري راشد العفاسي',
    style: 'Murattal',
    country: 'Kuwait',
    quality: 'High (192kbps)',
    popular: true,
  },
  {
    id: 'ar.abdulbasitmurattal',
    name: 'Abdul Basit Abdul Samad',
    nameArabic: 'عبد الباسط عبد الصمد',
    style: 'Murattal',
    country: 'Egypt',
    quality: 'High (192kbps)',
    popular: true,
  },
  {
    id: 'ar.husary',
    name: 'Mahmoud Khalil Al-Husary',
    nameArabic: 'محمود خليل الحصري',
    style: 'Murattal',
    country: 'Egypt',
    quality: 'High (128kbps)',
    popular: true,
  },
  {
    id: 'ar.minshawi',
    name: 'Mohamed Siddiq El-Minshawi',
    nameArabic: 'محمد صديق المنشاوي',
    style: 'Murattal',
    country: 'Egypt',
    quality: 'High (128kbps)',
    popular: false,
  },
  {
    id: 'ar.abdulsamad',
    name: 'Abdul Samad',
    nameArabic: 'عبد الصمد',
    style: 'Murattal',
    country: 'Egypt',
    quality: 'Medium (64kbps)',
    popular: false,
  },
  {
    id: 'ar.muhammadayyoub',
    name: 'Muhammad Ayyub',
    nameArabic: 'محمد أيوب',
    style: 'Murattal',
    country: 'Saudi Arabia',
    quality: 'High (128kbps)',
    popular: false,
  },
  {
    id: 'ar.shaatree',
    name: 'Abu Bakr al-Shatri',
    nameArabic: 'أبو بكر الشاطري',
    style: 'Murattal',
    country: 'Saudi Arabia',
    quality: 'High (128kbps)',
    popular: false,
  },
  {
    id: 'ar.hudhaify',
    name: 'Ali Al-Hudhaify',
    nameArabic: 'علي الحذيفي',
    style: 'Murattal',
    country: 'Saudi Arabia',
    quality: 'Medium (64kbps)',
    popular: false,
  },
] as const;

export type ReciterId = typeof QURAN_RECITERS[number]['id'];

/**
 * CDN base URL for audio files
 */
const CDN_BASE_URL = 'https://cdn.islamic.network/quran/audio';

/**
 * Audio quality options
 */
export type AudioQuality = '64' | '128' | '192';

/**
 * Get audio URL for a specific ayah
 * 
 * @param surahNumber - Surah number (1-114)
 * @param ayahNumber - Ayah number within the surah
 * @param reciter - Reciter ID (default: ar.alafasy)
 * @param quality - Audio quality in kbps (default: 128)
 * @returns Audio URL string
 * 
 * @example
 * getAyahAudioUrl(1, 1) // Returns URL for Al-Fatiha verse 1
 * getAyahAudioUrl(2, 255, 'ar.husary', '192') // Ayatul Kursi by Al-Husary
 */
export function getAyahAudioUrl(
  surahNumber: number,
  ayahNumber: number,
  reciter: ReciterId = 'ar.alafasy',
  quality: AudioQuality = '128'
): string {
  // Calculate the global ayah number
  const globalAyahNumber = getGlobalAyahNumber(surahNumber, ayahNumber);
  
  return `${CDN_BASE_URL}/${quality}/${reciter}/${globalAyahNumber}.mp3`;
}

/**
 * Get audio URL for an entire surah (single file)
 * 
 * @param surahNumber - Surah number (1-114)
 * @param reciter - Reciter ID
 * @param quality - Audio quality
 * @returns Audio URL for the complete surah
 */
export function getSurahAudioUrl(
  surahNumber: number,
  reciter: ReciterId = 'ar.alafasy',
  quality: AudioQuality = '128'
): string {
  const paddedNumber = surahNumber.toString().padStart(3, '0');
  return `${CDN_BASE_URL}-surah/${quality}/${reciter}/${paddedNumber}.mp3`;
}

/**
 * Get all ayah audio URLs for a surah
 * 
 * @param surahNumber - Surah number
 * @param totalAyahs - Total ayahs in the surah
 * @param reciter - Reciter ID
 * @param quality - Audio quality
 * @returns Array of audio URLs for each ayah
 */
export function getSurahAyahAudioUrls(
  surahNumber: number,
  totalAyahs: number,
  reciter: ReciterId = 'ar.alafasy',
  quality: AudioQuality = '128'
): string[] {
  return Array.from({ length: totalAyahs }, (_, i) =>
    getAyahAudioUrl(surahNumber, i + 1, reciter, quality)
  );
}

/**
 * Ayah count per surah (for calculating global ayah numbers)
 */
const AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
  111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73,
  54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60,
  49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52,
  44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19,
  26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3,
  6, 3, 5, 4, 5, 6
];

/**
 * Calculate global ayah number (1-6236)
 * 
 * @param surahNumber - Surah number (1-114)
 * @param ayahNumber - Ayah number within surah
 * @returns Global ayah number
 */
export function getGlobalAyahNumber(surahNumber: number, ayahNumber: number): number {
  if (surahNumber < 1 || surahNumber > 114) {
    throw new Error(`Invalid surah number: ${surahNumber}`);
  }
  
  let globalNumber = 0;
  
  // Add ayahs from all previous surahs
  for (let i = 0; i < surahNumber - 1; i++) {
    globalNumber += AYAH_COUNTS[i];
  }
  
  // Add the ayah number in current surah
  globalNumber += ayahNumber;
  
  return globalNumber;
}

/**
 * Get reciter information by ID
 * 
 * @param reciterId - Reciter ID
 * @returns Reciter object or undefined
 */
export function getReciterInfo(reciterId: ReciterId) {
  return QURAN_RECITERS.find(r => r.id === reciterId);
}

/**
 * Get popular reciters
 * 
 * @returns Array of popular reciters
 */
export function getPopularReciters() {
  return QURAN_RECITERS.filter(r => r.popular);
}

/**
 * Preload audio for smoother playback
 * 
 * @param urls - Array of audio URLs to preload
 * @returns Promise that resolves when all audio is preloaded
 */
export async function preloadAudio(urls: string[]): Promise<void> {
  const preloadPromises = urls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.oncanplaythrough = () => resolve();
      audio.onerror = () => reject(new Error(`Failed to preload: ${url}`));
      audio.src = url;
    });
  });
  
  await Promise.allSettled(preloadPromises);
}
