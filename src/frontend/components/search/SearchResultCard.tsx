/**
 * Search Result Card Components
 * 
 * Display cards for Quran and Hadith search results.
 */

"use client";

import Link from "next/link";
import { QuranSearchResult, HadithSearchResult, SearchResult } from "@/shared/types/search";
import { GRADE_COLORS, HadithGrade } from "@/shared/types/hadith";

/**
 * Highlight matched text in snippet
 */
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <span>{text}</span>;
  }
  
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="rounded bg-[var(--gold)]/30 px-0.5 text-[var(--foreground)]"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

/**
 * Quran search result card
 */
export function QuranResultCard({
  result,
  query,
}: {
  result: QuranSearchResult;
  query: string;
}) {
  return (
    <Link
      href={`/quran/${result.surahNumber}#verse-${result.surahNumber}-${result.ayahNumber}`}
      className="group block rounded-xl border border-[var(--gold)]/20 bg-[var(--background)] p-5 transition-all hover:border-[var(--gold)]/40 hover:shadow-lg"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Type badge */}
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Quran
          </span>
          
          {/* Reference */}
          <span className="text-sm font-medium text-[var(--gold)]">
            {result.surahNumber}:{result.ayahNumber}
          </span>
        </div>
        
        {/* Surah name */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--foreground-muted)]">
            {result.surahName}
          </span>
          <span className="font-amiri text-sm text-[var(--gold)]">
            {result.surahNameArabic}
          </span>
        </div>
      </div>
      
      {/* Arabic text */}
      <p
        className="mb-3 text-right font-amiri text-xl leading-loose text-[var(--foreground)]"
        dir="rtl"
      >
        {result.arabicText}
      </p>
      
      {/* Translation */}
      <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
        <HighlightedText text={result.translationText} query={query} />
      </p>
      
      {/* Source */}
      <p className="mt-2 text-xs text-[var(--foreground-muted)]">
        Translation: {result.translationSource}
      </p>
    </Link>
  );
}

/**
 * Hadith search result card
 */
export function HadithResultCard({
  result,
  query,
}: {
  result: HadithSearchResult;
  query: string;
}) {
  const gradeColors = GRADE_COLORS[result.grade as HadithGrade] || GRADE_COLORS.Unknown;
  
  return (
    <Link
      href={`/hadith/${result.collectionId}/${result.bookNumber}#hadith-${result.hadithNumber}`}
      className="group block rounded-xl border border-[var(--gold)]/20 bg-[var(--background)] p-5 transition-all hover:border-[var(--gold)]/40 hover:shadow-lg"
    >
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type badge */}
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
            </svg>
            Hadith
          </span>
          
          {/* Reference */}
          <span className="text-sm font-medium text-[var(--gold)]">
            #{result.hadithNumber}
          </span>
          
          {/* Grade */}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${gradeColors.bg} ${gradeColors.text} ${gradeColors.border}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {result.grade}
          </span>
        </div>
        
        {/* Collection */}
        <span className="text-sm text-[var(--foreground-muted)]">
          {result.collectionName}
        </span>
      </div>
      
      {/* Narrator */}
      {result.narrator && (
        <p className="mb-2 text-xs text-[var(--gold)]">
          Narrated by: <span className="font-medium">{result.narrator}</span>
        </p>
      )}
      
      {/* Arabic text */}
      <p
        className="mb-3 text-right font-amiri text-lg leading-loose text-[var(--foreground)]"
        dir="rtl"
      >
        {result.arabicText}
      </p>
      
      {/* English text */}
      <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
        <HighlightedText text={result.englishText} query={query} />
      </p>
      
      {/* Reference info */}
      <p className="mt-2 text-xs text-[var(--foreground-muted)]">
        Book {result.bookNumber} • Hadith {result.hadithNumber}
      </p>
    </Link>
  );
}

/**
 * Generic search result card
 */
export function SearchResultCard({
  result,
  query,
}: {
  result: SearchResult;
  query: string;
}) {
  if (result.type === "quran") {
    return <QuranResultCard result={result} query={query} />;
  }
  return <HadithResultCard result={result} query={query} />;
}
