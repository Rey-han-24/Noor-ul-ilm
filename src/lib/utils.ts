/**
 * Noor ul Ilm - Utility Functions
 *
 * Common helper functions used throughout the application.
 * All functions are pure and well-documented.
 */

/**
 * Formats a Quran verse reference
 * @param surahNumber - Surah number (1-114)
 * @param verseNumber - Verse number
 * @returns Formatted reference (e.g., "2:255")
 */
export function formatVerseReference(
  surahNumber: number,
  verseNumber: number
): string {
  return `${surahNumber}:${verseNumber}`;
}

/**
 * Formats a Hadith reference
 * @param collection - Collection name (e.g., "Bukhari")
 * @param bookNumber - Book number
 * @param hadithNumber - Hadith number
 * @returns Formatted reference (e.g., "Bukhari 1:1")
 */
export function formatHadithReference(
  collection: string,
  bookNumber: number,
  hadithNumber: number
): string {
  return `${collection} ${bookNumber}:${hadithNumber}`;
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Debounce function for search inputs
 * @param func - Function to debounce
 * @param waitMs - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func.apply(this, args), waitMs);
  };
}

/**
 * Converts Arabic numerals to Eastern Arabic numerals
 * Used for displaying verse numbers in Arabic style
 * @param num - Number to convert
 * @returns Arabic numeral string
 */
export function toArabicNumerals(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit)] || digit)
    .join("");
}

/**
 * Generates a className string from conditional classes
 * Similar to clsx/classnames libraries
 * @param classes - Object with class names as keys and booleans as values
 * @returns Combined class string
 */
export function cn(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a date for display
 * @param date - Date to format
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date,
  locale: string = "en-US"
): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Formats currency for donation displays
 * @param amount - Amount in cents or smallest currency unit
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Checks if text contains Arabic characters
 * @param text - Text to check
 * @returns True if contains Arabic
 */
export function containsArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicPattern.test(text);
}

/**
 * Gets the text direction based on language code
 * @param languageCode - ISO language code
 * @returns 'rtl' or 'ltr'
 */
export function getTextDirection(languageCode: string): "rtl" | "ltr" {
  const rtlLanguages = ["ar", "ur", "fa", "he"];
  return rtlLanguages.includes(languageCode) ? "rtl" : "ltr";
}
