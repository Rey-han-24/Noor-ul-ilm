/**
 * HadithCard Component
 * 
 * Displays a single hadith with:
 * - Arabic text
 * - English translation
 * - Narrator information
 * - Grading badge
 * - Bookmark option
 */

"use client";

import { useState, useCallback } from "react";
import { Hadith, HadithGrade, GRADE_COLORS, HadithBookmark } from "@/shared/types/hadith";

interface HadithCardProps {
  /** The hadith to display */
  hadith: Hadith;
  /** Collection ID for reference */
  collectionId: string;
  /** Collection name for display */
  collectionName: string;
  /** Whether this hadith is bookmarked */
  isBookmarked?: boolean;
  /** Callback when bookmark is toggled */
  onBookmark?: (hadith: Hadith) => void;
  /** Whether to show full text or truncated */
  expanded?: boolean;
  /** Global Arabic text visibility (controlled by parent) */
  showArabicGlobal?: boolean;
}

/**
 * Grade badge component
 */
function GradeBadge({ grade }: { grade: HadithGrade }) {
  const colors = GRADE_COLORS[grade];
  
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {grade}
    </span>
  );
}

export default function HadithCard({
  hadith,
  collectionId,
  collectionName,
  isBookmarked = false,
  onBookmark,
  expanded = true,
  showArabicGlobal,
}: HadithCardProps) {
  // Local toggle only used when showArabicGlobal is undefined
  const [showArabicLocal, setShowArabicLocal] = useState(true);
  const [isExpanded, setIsExpanded] = useState(expanded);

  // Use global setting if provided, otherwise use local state
  const showArabic = showArabicGlobal !== undefined ? showArabicGlobal : showArabicLocal;
  const toggleArabic = showArabicGlobal !== undefined 
    ? undefined // No local toggle when controlled globally
    : () => setShowArabicLocal(!showArabicLocal);

  // Handle bookmark click
  const handleBookmark = useCallback(() => {
    if (onBookmark) {
      onBookmark(hadith);
    }
  }, [hadith, onBookmark]);

  // Truncate text if not expanded
  const displayText = isExpanded
    ? hadith.englishText
    : hadith.englishText.slice(0, 300) + (hadith.englishText.length > 300 ? "..." : "");

  return (
    <article
      className={`group relative rounded-xl border bg-[var(--background)] p-5 transition-all duration-300 sm:p-6 ${
        isBookmarked
          ? "border-[var(--gold)]/50 bg-[var(--gold)]/5"
          : "border-[var(--gold)]/20 hover:border-[var(--gold)]/40"
      }`}
      id={`hadith-${hadith.hadithNumber}`}
    >
      {/* Bookmark indicator */}
      {isBookmarked && (
        <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-[var(--gold)]" />
      )}

      {/* Header */}
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        {/* Reference & Grade */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hadith Number */}
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-2.5 py-1 text-sm font-medium text-[var(--gold)]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            {hadith.hadithNumber}
          </span>

          {/* Grade */}
          <GradeBadge grade={hadith.grade} />

          {/* Bookmarked label */}
          {isBookmarked && (
            <span className="text-xs text-[var(--gold)]">Bookmarked</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Toggle Arabic - Only show when not controlled globally */}
          {toggleArabic && (
            <button
              onClick={toggleArabic}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                showArabic
                  ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--primary)]"
                  : "border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)]/10"
              }`}
              title={showArabic ? "Hide Arabic" : "Show Arabic"}
            >
              عربي
            </button>
          )}

          {/* Bookmark Button */}
          {onBookmark && (
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                isBookmarked
                  ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--primary)]"
                  : "border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)]/10"
              }`}
              title={isBookmarked ? "Remove bookmark" : "Bookmark this hadith"}
            >
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
          )}
        </div>
      </header>

      {/* Narrator */}
      {hadith.primaryNarrator && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="text-[var(--foreground-muted)]">Narrated by:</span>
          <span className="font-medium text-[var(--foreground)]">{hadith.primaryNarrator}</span>
          {hadith.primaryNarratorArabic && (
            <span className="arabic-text text-[var(--foreground-muted)]">
              ({hadith.primaryNarratorArabic})
            </span>
          )}
        </div>
      )}

      {/* Arabic Text */}
      {showArabic && hadith.arabicText && (
        <div className="mb-4 rounded-lg border border-[var(--gold)]/10 bg-[var(--background-secondary)] p-4">
          <p
            className="arabic-text text-right text-lg leading-loose text-[var(--foreground)] sm:text-xl"
            dir="rtl"
          >
            {hadith.arabicText}
          </p>
        </div>
      )}

      {/* English Translation */}
      <div className="mb-4">
        <p className="text-sm leading-relaxed text-[var(--foreground-secondary)] sm:text-base">
          {displayText}
        </p>
        {!expanded && hadith.englishText.length > 300 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm font-medium text-[var(--gold)] hover:underline"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--gold)]/10 pt-4 text-xs text-[var(--foreground-muted)]">
        {/* Reference */}
        <div className="flex items-center gap-2">
          <span>{collectionName}</span>
          <span>•</span>
          <span>{hadith.reference}</span>
          {hadith.inBookReference && (
            <>
              <span>•</span>
              <span>{hadith.inBookReference}</span>
            </>
          )}
        </div>

        {/* Graded by */}
        {hadith.gradedBy && (
          <div>
            Graded by: {hadith.gradedBy}
          </div>
        )}
      </footer>
    </article>
  );
}
