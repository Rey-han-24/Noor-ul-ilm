/**
 * HadithBookClient Component
 * 
 * Client-side wrapper for the Hadith book reading page.
 * Handles bookmark state and reading controls.
 * Syncs bookmarks to both localStorage and server API.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Hadith, HadithBookmark } from "@/shared/types/hadith";
import HadithCard from "@/frontend/components/hadith/HadithCard";

interface HadithBookClientProps {
  /** Array of hadiths to display */
  hadiths: Hadith[];
  /** Collection ID */
  collectionId: string;
  /** Collection name for display */
  collectionName: string;
  /** Current book number */
  bookNumber: number;
  /** Book name for display */
  bookName: string;
}

const HADITH_BOOKMARK_KEY = "noor-ul-ilm-hadith-bookmark";
const HADITH_TUTORIAL_KEY = "noor-ul-ilm-hadith-tutorial-seen";

/**
 * Get saved bookmark from localStorage
 */
function getSavedBookmark(): HadithBookmark | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(HADITH_BOOKMARK_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Save bookmark to localStorage
 */
function saveBookmarkLocal(bookmark: HadithBookmark): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HADITH_BOOKMARK_KEY, JSON.stringify(bookmark));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Save bookmark to server API
 */
async function saveBookmarkToServer(bookmark: HadithBookmark): Promise<boolean> {
  try {
    const response = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'HADITH',
        collectionId: bookmark.collectionId,
        bookNumber: bookmark.bookNumber,
        hadithNumber: bookmark.hadithNumber,
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
async function removeBookmarkFromServer(
  collectionId: string,
  bookNumber: number,
  hadithNumber: number
): Promise<boolean> {
  try {
    const params = new URLSearchParams({
      type: 'HADITH',
      collectionId,
      bookNumber: bookNumber.toString(),
      hadithNumber: hadithNumber.toString(),
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
  return localStorage.getItem(HADITH_TUTORIAL_KEY) === "true";
}

/**
 * Mark tutorial as seen
 */
function markTutorialSeen(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HADITH_TUTORIAL_KEY, "true");
}

export default function HadithBookClient({
  hadiths,
  collectionId,
  collectionName,
  bookNumber,
  bookName,
}: HadithBookClientProps) {
  const [bookmark, setBookmark] = useState<HadithBookmark | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showArabicAll, setShowArabicAll] = useState(true);

  // Load bookmark and check tutorial on mount
  useEffect(() => {
    const savedBookmark = getSavedBookmark();
    setBookmark(savedBookmark);

    // Show tutorial if not seen before
    if (!hasTutorialBeenSeen()) {
      setShowTutorial(true);
    }

    // Scroll to bookmarked hadith if on same book
    if (
      savedBookmark &&
      savedBookmark.collectionId === collectionId &&
      savedBookmark.bookNumber === bookNumber
    ) {
      setTimeout(() => {
        const element = document.getElementById(`hadith-${savedBookmark.hadithNumber}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);
    }
  }, [collectionId, bookNumber]);

  // Handle bookmark click
  const handleBookmark = useCallback(
    (hadith: Hadith) => {
      const newBookmark: HadithBookmark = {
        collectionId,
        collectionName,
        bookNumber,
        hadithNumber: hadith.hadithNumber,
        textPreview: hadith.englishText.slice(0, 100) + "...",
        timestamp: Date.now(),
      };

      // If clicking on already bookmarked hadith, remove it
      if (
        bookmark?.collectionId === collectionId &&
        bookmark?.bookNumber === bookNumber &&
        bookmark?.hadithNumber === hadith.hadithNumber
      ) {
        setBookmark(null);
        localStorage.removeItem(HADITH_BOOKMARK_KEY);
        // Also remove from server
        removeBookmarkFromServer(collectionId, bookNumber, hadith.hadithNumber);
        setToastMessage("Bookmark removed");
      } else {
        // Save new bookmark to both local and server
        saveBookmarkLocal(newBookmark);
        saveBookmarkToServer(newBookmark);
        setBookmark(newBookmark);
        setToastMessage(`Bookmarked ${collectionName} ${hadith.hadithNumber}`);
      }

      // Clear toast after 3 seconds
      setTimeout(() => setToastMessage(null), 3000);
    },
    [bookmark, collectionId, collectionName, bookNumber]
  );

  // Dismiss tutorial
  const handleDismissTutorial = useCallback(() => {
    setShowTutorial(false);
    markTutorialSeen();
  }, []);

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Tutorial Banner */}
        {showTutorial && (
          <div
            className="mb-6 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 p-4"
            style={{ animation: "slideDown 300ms ease-out" }}
          >
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 flex-shrink-0 text-[var(--gold)]"
              >
                <path
                  fillRule="evenodd"
                  d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h4 className="font-semibold text-[var(--foreground)]">
                  Bookmark Your Reading Progress
                </h4>
                <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                  Click the bookmark icon on any hadith to save your place. You can resume
                  reading from your bookmark anytime!
                </p>
              </div>
              <button
                onClick={handleDismissTutorial}
                className="flex-shrink-0 rounded-lg bg-[var(--gold)] px-3 py-1.5 text-sm font-medium text-[var(--primary)]"
              >
                Got it!
              </button>
            </div>
          </div>
        )}

        {/* Resume Bookmark Banner (if bookmarked in different location) */}
        {bookmark &&
          (bookmark.collectionId !== collectionId || bookmark.bookNumber !== bookNumber) && (
            <div
              className="mb-6 flex items-center justify-between rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 p-4"
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
                    You have a bookmark in {bookmark.collectionName}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    Book {bookmark.bookNumber}, Hadith {bookmark.hadithNumber}
                  </p>
                </div>
              </div>
              <a
                href={`/hadith/${bookmark.collectionId}/${bookmark.bookNumber}#hadith-${bookmark.hadithNumber}`}
                className="rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--gold-light)]"
              >
                Resume Reading
              </a>
            </div>
          )}

        {/* Reading Controls */}
        <div className="mb-6 flex items-center justify-between rounded-lg border border-[var(--gold)]/20 bg-[var(--background-secondary)] p-4">
          <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
            <span>{hadiths.length} Hadiths</span>
          </div>

          <button
            onClick={() => setShowArabicAll(!showArabicAll)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              showArabicAll
                ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--primary)]"
                : "border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--primary)]"
            }`}
          >
            {showArabicAll ? "✓ Arabic On" : "Arabic Off"}
          </button>
        </div>

        {/* Hadiths List */}
        {hadiths.length > 0 ? (
          <div className="space-y-6">
            {hadiths.map((hadith) => (
              <HadithCard
                key={hadith.hadithNumber}
                hadith={hadith}
                collectionId={collectionId}
                collectionName={collectionName}
                isBookmarked={
                  bookmark?.collectionId === collectionId &&
                  bookmark?.bookNumber === bookNumber &&
                  bookmark?.hadithNumber === hadith.hadithNumber
                }
                onBookmark={handleBookmark}
                showArabicGlobal={showArabicAll}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--gold)]/20 bg-[var(--background-secondary)] p-8 text-center">
            <p className="text-[var(--foreground-muted)]">
              No hadiths found in this book. Please try again later.
            </p>
          </div>
        )}

        {/* Bottom Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[var(--foreground-muted)]">
            {collectionName} • Book {bookNumber}: {bookName}
          </p>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Source: Sunnah.com API (Verified)
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
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
            <span className="text-sm font-medium text-[var(--foreground)]">{toastMessage}</span>
          </div>
        </div>
      )}
    </section>
  );
}
