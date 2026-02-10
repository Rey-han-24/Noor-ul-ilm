/**
 * SurahReader Component
 * 
 * Displays Quran verses in a verse-by-verse format.
 * Each verse shows:
 * - Verse number (in Arabic numerals)
 * - Arabic text (Uthmani script)
 * - Translation (toggleable globally)
 * - Bookmark icon to save reading progress
 * - Audio play button for individual verse recitation
 * 
 * Similar to Islam360 reading experience.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { SurahDetail, AyahTranslation, TRANSLATION_EDITIONS } from "@/shared/types/quran";
import { toArabicNumeral } from "@/backend/services/quran-api";
import { getAyahAudioUrl, QURAN_RECITERS, ReciterId } from "@/backend/services/quran-audio";

interface SurahReaderProps {
  /** Complete Surah data with Arabic text */
  surah: SurahDetail;
  /** Array of translations for each verse */
  translations: AyahTranslation[];
  /** Currently selected translation edition */
  currentTranslation: string;
}

/** Bookmark data stored in localStorage */
interface Bookmark {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  timestamp: number;
}

const BOOKMARK_KEY = "noor-ul-ilm-bookmark";
const BOOKMARK_TUTORIAL_KEY = "noor-ul-ilm-bookmark-tutorial-seen";

/**
 * Get saved bookmark from localStorage
 */
function getSavedBookmark(): Bookmark | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(BOOKMARK_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Save bookmark to localStorage
 */
function saveBookmarkLocal(bookmark: Bookmark): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Save bookmark to server API
 */
async function saveBookmarkToServer(surahNumber: number, ayahNumber: number): Promise<boolean> {
  try {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'QURAN',
        surahNumber,
        ayahNumber,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Remove bookmark from server API
 */
async function removeBookmarkFromServer(surahNumber: number, ayahNumber: number): Promise<boolean> {
  try {
    const params = new URLSearchParams({
      type: 'QURAN',
      surahNumber: surahNumber.toString(),
      ayahNumber: ayahNumber.toString(),
    });
    const response = await fetch(`/api/bookmarks?${params}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Check if tutorial has been seen
 */
function hasTutorialBeenSeen(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(BOOKMARK_TUTORIAL_KEY) === "true";
}

/**
 * Mark tutorial as seen
 */
function markTutorialSeen(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BOOKMARK_TUTORIAL_KEY, "true");
}

/**
 * Individual Verse Component with Bookmark and Audio
 */
function VerseCard({
  verseNumber,
  arabicText,
  translation,
  surahNumber,
  showTranslation,
  isBookmarked,
  onBookmark,
  showTutorial,
  onDismissTutorial,
  isPlaying,
  isPaused,
  isLoading,
  onPlayAudio,
}: {
  verseNumber: number;
  arabicText: string;
  translation: string;
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  showTranslation: boolean;
  isBookmarked: boolean;
  onBookmark: () => void;
  showTutorial: boolean;
  onDismissTutorial: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  onPlayAudio: () => void;
}) {
  return (
    <div 
      className={`group relative border-b border-[var(--gold)]/10 py-6 last:border-b-0 ${
        isBookmarked ? "bg-[var(--gold)]/5" : ""
      } ${isPlaying ? "bg-[var(--gold)]/10" : ""}`}
      data-verse-number={verseNumber}
      id={`verse-${surahNumber}-${verseNumber}`}
    >
      {/* Playing/Paused indicator bar */}
      {isPlaying && (
        <div className={`absolute left-0 top-0 h-full w-1 bg-[var(--gold)] ${isPaused ? "" : "animate-pulse"}`} />
      )}
      
      {/* Bookmarked indicator bar */}
      {isBookmarked && !isPlaying && (
        <div className="absolute left-0 top-0 h-full w-1 bg-[var(--gold)]" />
      )}

      {/* Verse Header */}
      <div className="mb-4 flex items-center justify-between">
        {/* Verse Number Badge */}
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${
            isBookmarked 
              ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--primary)]" 
              : "border-[var(--gold)]/40 bg-[var(--gold)]/10"
          }`}>
            <span className={`arabic-text text-sm font-medium ${
              isBookmarked ? "" : "text-[var(--gold)]"
            }`}>
              {toArabicNumeral(verseNumber)}
            </span>
          </div>
          <span className="text-xs text-[var(--foreground-muted)]">
            {surahNumber}:{verseNumber}
          </span>
          {isBookmarked && (
            <span className="rounded-full bg-[var(--gold)]/20 px-2 py-0.5 text-xs font-medium text-[var(--gold)]">
              Bookmarked
            </span>
          )}
          {isPlaying && (
            <span className="flex items-center gap-1 rounded-full bg-[var(--gold)]/20 px-2 py-0.5 text-xs font-medium text-[var(--gold)]">
              <span className={`inline-block h-2 w-2 rounded-full bg-[var(--gold)] ${isPaused ? "" : "animate-pulse"}`} />
              {isPaused ? "Paused" : "Playing"}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="relative flex items-center gap-2">
          {/* Audio Play/Pause Button */}
          <button
            onClick={onPlayAudio}
            disabled={isLoading}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition-all ${
              isPlaying
                ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--primary)]"
                : "border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)]/10"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={isPlaying ? (isPaused ? "Resume audio" : "Pause audio") : "Play audio"}
            title={isPlaying ? (isPaused ? "Resume recitation" : "Pause recitation") : "Listen to this verse"}
          >
            {isLoading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : isPlaying && !isPaused ? (
              /* Pause icon - two vertical bars */
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              /* Play icon - triangle */
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={onBookmark}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition-all ${
              isBookmarked
                ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--primary)]"
                : "border-[var(--gold)]/30 text-[var(--gold)] sm:opacity-0 sm:group-hover:opacity-100 hover:bg-[var(--gold)]/10"
            }`}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this verse"}
            title={isBookmarked ? "Bookmarked - Click to remove" : "Bookmark this verse"}
          >
            {/* Bookmark Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
          </button>

          {/* Tutorial Tooltip - Only show on first verse and first visit */}
          {showTutorial && verseNumber === 1 && (
            <div 
              className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] p-4 shadow-xl"
              style={{ animation: "slideDown 300ms ease-out" }}
            >
              {/* Arrow */}
              <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 border-l border-t border-[var(--gold)]/30 bg-[var(--background)]" />
              
              <div className="relative">
                <div className="mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-[var(--gold)]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h4 className="font-semibold text-[var(--foreground)]">Quick Tips</h4>
                </div>
                <p className="text-sm text-[var(--foreground-muted)]">
                  <strong>🔊 Play</strong> - Listen to verse recitation<br/>
                  <strong>🔖 Bookmark</strong> - Save your reading progress
                </p>
                <button
                  onClick={onDismissTutorial}
                  className="mt-3 w-full rounded-lg bg-[var(--gold)] px-3 py-1.5 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--gold-light)]"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Arabic Text */}
      <p 
        className="arabic-text quran-verse text-right text-2xl leading-[2.5] text-[var(--foreground)] sm:text-3xl md:text-4xl"
        dir="rtl"
      >
        {arabicText}
        {/* End of verse marker */}
        <span className="mx-2 inline-block text-[var(--gold)]">
          ﴿{toArabicNumeral(verseNumber)}﴾
        </span>
      </p>

      {/* Translation */}
      {showTranslation && (
        <div className="mt-4 rounded-lg bg-[var(--background-secondary)] p-4">
          <p className="text-sm leading-relaxed text-[var(--foreground-secondary)]">
            <span className="mr-2 font-medium text-[var(--gold)]">{verseNumber}.</span>
            {translation}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Main SurahReader Component
 */
export default function SurahReader({
  surah,
  translations,
  currentTranslation,
}: SurahReaderProps) {
  const router = useRouter();
  const [selectedTranslation, setSelectedTranslation] = useState(currentTranslation);
  const [showAllTranslations, setShowAllTranslations] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);

  // Audio state
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [audioLoading, setAudioLoading] = useState<number | null>(null);
  const [selectedReciter, setSelectedReciter] = useState<ReciterId>('ar.alafasy');
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const [fullSurahProgress, setFullSurahProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAyahRef = useRef<number | null>(null); // Track current ayah for reciter changes

  // Get current translation edition info
  const currentEdition = TRANSLATION_EDITIONS.find(
    (e) => e.identifier === selectedTranslation
  ) || TRANSLATION_EDITIONS[0];

  // Get current reciter info
  const currentReciter = QURAN_RECITERS.find(r => r.id === selectedReciter);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Load bookmark and check tutorial on mount
  useEffect(() => {
    const savedBookmark = getSavedBookmark();
    
    // Use requestAnimationFrame to defer state updates
    requestAnimationFrame(() => {
      setBookmark(savedBookmark);
      
      // Show tutorial if not seen before
      if (!hasTutorialBeenSeen()) {
        setShowTutorial(true);
      }
    });

    // Scroll to bookmarked verse if on same surah
    if (savedBookmark && savedBookmark.surahNumber === surah.number) {
      setTimeout(() => {
        const element = document.getElementById(`verse-${savedBookmark.surahNumber}-${savedBookmark.ayahNumber}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
    }
  }, [surah.number]);

  // Handle bookmark click
  const handleBookmark = useCallback((ayahNumber: number) => {
    const newBookmark: Bookmark = {
      surahNumber: surah.number,
      surahName: surah.englishName,
      surahNameArabic: surah.name,
      ayahNumber,
      timestamp: Date.now(),
    };

    // If clicking on already bookmarked verse, remove it
    if (bookmark?.surahNumber === surah.number && bookmark?.ayahNumber === ayahNumber) {
      setBookmark(null);
      localStorage.removeItem(BOOKMARK_KEY);
      // Also remove from server
      removeBookmarkFromServer(surah.number, ayahNumber);
      setBookmarkToast("Bookmark removed");
    } else {
      // Save new bookmark to both local and server
      saveBookmarkLocal(newBookmark);
      saveBookmarkToServer(surah.number, ayahNumber);
      setBookmark(newBookmark);
      setBookmarkToast(`Bookmarked ${surah.englishName} ${surah.number}:${ayahNumber}`);
    }

    // Clear toast after 3 seconds
    setTimeout(() => setBookmarkToast(null), 3000);
  }, [bookmark, surah]);

  // Dismiss tutorial
  const handleDismissTutorial = useCallback(() => {
    setShowTutorial(false);
    markTutorialSeen();
  }, []);

  /**
   * Play audio for a single ayah
   * Supports play/pause/resume functionality
   */
  const handlePlayAyah = useCallback((ayahNumber: number) => {
    if (!audioRef.current) return;

    // If already playing this ayah, toggle pause/play
    if (playingAyah === ayahNumber) {
      if (isPaused) {
        // Resume playback
        audioRef.current.play();
        setIsPaused(false);
      } else {
        // Pause playback
        audioRef.current.pause();
        setIsPaused(true);
      }
      return;
    }

    // If paused on a different ayah, or playing a different ayah, switch to new ayah
    // Stop any current playback
    audioRef.current.pause();
    setIsPlayingFullSurah(false);
    setIsPaused(false);

    // Set loading state
    setAudioLoading(ayahNumber);
    currentAyahRef.current = ayahNumber;

    // Get audio URL
    const audioUrl = getAyahAudioUrl(surah.number, ayahNumber, selectedReciter);
    audioRef.current.src = audioUrl;

    // Handle audio events
    const handleCanPlay = () => {
      setAudioLoading(null);
      setPlayingAyah(ayahNumber);
      setIsPaused(false);
      audioRef.current?.play();
    };

    const handleEnded = () => {
      setPlayingAyah(null);
      setAudioLoading(null);
      setIsPaused(false);
      currentAyahRef.current = null;
    };

    const handleError = () => {
      setPlayingAyah(null);
      setAudioLoading(null);
      setIsPaused(false);
      currentAyahRef.current = null;
      console.error('Failed to load audio for ayah:', ayahNumber);
    };

    // Clean up old listeners and add new ones
    audioRef.current.oncanplay = handleCanPlay;
    audioRef.current.onended = handleEnded;
    audioRef.current.onerror = handleError;

    // Start loading
    audioRef.current.load();
  }, [playingAyah, isPaused, selectedReciter, surah.number]);

  /**
   * Play full surah - continuous playback through all ayahs
   * Supports pause/resume functionality
   */
  const handlePlayFullSurah = useCallback(() => {
    if (!audioRef.current) return;

    // If currently playing full surah
    if (isPlayingFullSurah) {
      if (isPaused) {
        // Resume playback
        audioRef.current.play();
        setIsPaused(false);
      } else {
        // Pause playback (don't reset)
        audioRef.current.pause();
        setIsPaused(true);
      }
      return;
    }

    // Start fresh - from ayah 1
    setIsPlayingFullSurah(true);
    setIsPaused(false);
    setFullSurahProgress(1);
    
    const playNextAyah = (ayahNumber: number) => {
      if (!audioRef.current || ayahNumber > surah.numberOfAyahs) {
        // Surah finished
        setPlayingAyah(null);
        setIsPlayingFullSurah(false);
        setFullSurahProgress(0);
        setIsPaused(false);
        currentAyahRef.current = null;
        return;
      }

      setAudioLoading(ayahNumber);
      currentAyahRef.current = ayahNumber;
      const audioUrl = getAyahAudioUrl(surah.number, ayahNumber, selectedReciter);
      audioRef.current.src = audioUrl;

      audioRef.current.oncanplay = () => {
        setAudioLoading(null);
        setPlayingAyah(ayahNumber);
        setFullSurahProgress(ayahNumber);
        setIsPaused(false);
        
        // Scroll to current ayah
        const element = document.getElementById(`verse-${surah.number}-${ayahNumber}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        audioRef.current?.play();
      };

      audioRef.current.onended = () => {
        // Play next ayah
        playNextAyah(ayahNumber + 1);
      };

      audioRef.current.onerror = () => {
        setPlayingAyah(null);
        setAudioLoading(null);
        setIsPlayingFullSurah(false);
        setIsPaused(false);
        currentAyahRef.current = null;
        console.error('Failed to load audio for ayah:', ayahNumber);
      };

      audioRef.current.load();
    };

    playNextAyah(1);
  }, [isPlayingFullSurah, isPaused, selectedReciter, surah.number, surah.numberOfAyahs]);

  /**
   * Stop all audio playback
   */
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingAyah(null);
    setIsPlayingFullSurah(false);
    setFullSurahProgress(0);
    setAudioLoading(null);
    setIsPaused(false);
    currentAyahRef.current = null;
  }, []);

  // Handle translation change - navigate to update the page
  const handleTranslationChange = (newTranslation: string) => {
    setSelectedTranslation(newTranslation);
    setIsLoading(true);
    router.push(`/quran/${surah.number}?translation=${newTranslation}`);
  };

  // Reset loading when translations update
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsLoading(false);
      setSelectedTranslation(currentTranslation);
    });
  }, [translations, currentTranslation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Audio Controls - Play Full Surah */}
        <div className="mb-6 rounded-lg border border-[var(--gold)]/20 bg-[var(--background-secondary)] p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Play Full Surah Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePlayFullSurah}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  isPlayingFullSurah
                    ? "bg-[var(--gold)] text-[var(--primary)]"
                    : "border border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--primary)]"
                }`}
              >
                {isPlayingFullSurah && !isPaused ? (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                    Pause Surah
                  </>
                ) : isPlayingFullSurah && isPaused ? (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Resume Surah
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play Full Surah
                  </>
                )}
              </button>
              
              {/* Stop button when playing */}
              {isPlayingFullSurah && (
                <button
                  onClick={stopAudio}
                  className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                  title="Stop and reset"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 6h12v12H6z" />
                  </svg>
                  Stop
                </button>
              )}
              
              {/* Progress indicator when playing */}
              {isPlayingFullSurah && (
                <span className="text-sm text-[var(--foreground-muted)]">
                  Ayah {fullSurahProgress} of {surah.numberOfAyahs} {isPaused ? "(Paused)" : ""}
                </span>
              )}
            </div>

            {/* Reciter Selector */}
            <div className="flex items-center gap-3">
              <label 
                htmlFor="reciter-select" 
                className="text-xs font-medium text-[var(--foreground-muted)]"
              >
                Reciter:
              </label>
              <select
                id="reciter-select"
                value={selectedReciter}
                onChange={(e) => {
                  stopAudio();
                  setSelectedReciter(e.target.value as ReciterId);
                }}
                className="rounded border border-[var(--gold)]/30 bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
              >
                {QURAN_RECITERS.map((reciter) => (
                  <option key={reciter.id} value={reciter.id}>
                    {reciter.name} {reciter.popular ? '⭐' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current reciter info */}
          {currentReciter && (
            <div className="mt-3 text-xs text-[var(--foreground-muted)]">
              🎙️ {currentReciter.name} ({currentReciter.nameArabic}) • {currentReciter.style} • {currentReciter.country}
            </div>
          )}
        </div>

        {/* Reading Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--gold)]/20 bg-[var(--background-secondary)] p-4">
          {/* Translation Selector */}
          <div className="flex items-center gap-3">
            <label 
              htmlFor="translation-select" 
              className="text-xs font-medium text-[var(--foreground-muted)]"
            >
              Translation:
            </label>
            <select
              id="translation-select"
              value={selectedTranslation}
              onChange={(e) => handleTranslationChange(e.target.value)}
              disabled={isLoading}
              className="rounded border border-[var(--gold)]/30 bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)] disabled:opacity-50"
            >
              {TRANSLATION_EDITIONS.map((edition) => (
                <option key={edition.identifier} value={edition.identifier}>
                  {edition.englishName}
                </option>
              ))}
            </select>
            {isLoading && (
              <span className="text-xs text-[var(--gold)]">Loading...</span>
            )}
          </div>

          {/* Show/Hide All Translations */}
          <button
            onClick={() => setShowAllTranslations(!showAllTranslations)}
            className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
              showAllTranslations
                ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--primary)]"
                : "border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--primary)]"
            }`}
          >
            {showAllTranslations ? "✓ Translations On" : "Translations Off"}
          </button>
        </div>

        {/* Current Bookmark Banner (if bookmarked in different surah) */}
        {bookmark && bookmark.surahNumber !== surah.number && (
          <div 
            className="mb-6 flex items-center justify-between rounded-lg border border-[var(--gold)]/30 bg-[var(--gold)]/5 p-4"
            style={{ animation: "slideDown 300ms ease-out" }}
          >
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-[var(--gold)]"
              >
                <path
                  fillRule="evenodd"
                  d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  You have a bookmark in {bookmark.surahName}
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Verse {bookmark.ayahNumber} • {bookmark.surahNameArabic}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/quran/${bookmark.surahNumber}#verse-${bookmark.surahNumber}-${bookmark.ayahNumber}`)}
              className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--gold-light)]"
            >
              Resume Reading
            </button>
          </div>
        )}

        {/* Verse List */}
        <div className="rounded-lg border border-[var(--gold)]/20 bg-[var(--background)] px-4 sm:px-6">
          {surah.ayahs.map((ayah) => {
            // Find matching translation by verse number (not by array index)
            const translation = translations.find(t => t.numberInSurah === ayah.numberInSurah);
            
            return (
              <VerseCard
                key={ayah.numberInSurah}
                verseNumber={ayah.numberInSurah}
                arabicText={ayah.text}
                translation={translation?.text || "Translation not available"}
                surahNumber={surah.number}
                surahName={surah.englishName}
                surahNameArabic={surah.name}
                showTranslation={showAllTranslations}
                isBookmarked={
                  bookmark?.surahNumber === surah.number && 
                  bookmark?.ayahNumber === ayah.numberInSurah
                }
                onBookmark={() => handleBookmark(ayah.numberInSurah)}
                showTutorial={showTutorial}
                onDismissTutorial={handleDismissTutorial}
                isPlaying={playingAyah === ayah.numberInSurah}
                isPaused={isPaused && playingAyah === ayah.numberInSurah}
                isLoading={audioLoading === ayah.numberInSurah}
                onPlayAudio={() => handlePlayAyah(ayah.numberInSurah)}
              />
            );
          })}
        </div>

        {/* Bottom Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--foreground-muted)]">
            Arabic text: Uthmani Script • Translation: {currentEdition.englishName}
          </p>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Source: Al-Quran Cloud API (Verified)
          </p>
        </div>
      </div>

      {/* Bookmark Toast Notification */}
      {bookmarkToast && (
        <div 
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform"
          style={{ animation: "slideUp 300ms ease-out" }}
        >
          <div className="flex items-center gap-3 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] px-4 py-3 shadow-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-[var(--gold)]"
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-[var(--foreground)]">
              {bookmarkToast}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
