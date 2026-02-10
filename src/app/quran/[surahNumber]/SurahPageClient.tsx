/**
 * SurahPageClient Component
 * 
 * Client-side wrapper for the Surah page with sidebar.
 * Handles the sidebar state and layout.
 * 
 * Features:
 * - Collapsible sidebar for surah navigation
 * - Responsive design for mobile and desktop
 * 
 * NOTE: Header and Footer are rendered by the parent server component.
 * NOTE: Audio player is now integrated directly into SurahReader component.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import SurahSidebar from "@/frontend/components/quran/SurahSidebar";
import SurahReader from "@/frontend/components/quran/SurahReader";
import { SurahDetail, AyahTranslation, Surah } from "@/shared/types/quran";

interface SurahPageClientProps {
  surah: SurahDetail;
  translations: AyahTranslation[];
  currentTranslation: string;
  surahMeta: Surah;
  prevSurah: Surah | null;
  nextSurah: Surah | null;
}

const SIDEBAR_STATE_KEY = "noor-ul-ilm-sidebar-state";

/**
 * Get saved sidebar state from localStorage
 */
function getSavedSidebarState(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
    return saved !== null ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Save sidebar state to localStorage
 */
function saveSidebarState(isOpen: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(isOpen));
  } catch {
    // Ignore storage errors
  }
}

export default function SurahPageClient({
  surah,
  translations,
  currentTranslation,
  surahMeta,
  prevSurah,
  nextSurah,
}: SurahPageClientProps) {
  // Use a lazy initializer for sidebar state - cannot be done because window doesn't exist on server
  // We'll use null initially and set it on mount
  const [sidebarOpen, setSidebarOpen] = useState<boolean | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const hasRecordedHistory = useRef(false);

  // Record reading history on mount
  useEffect(() => {
    if (hasRecordedHistory.current) return;
    
    const recordHistory = async () => {
      try {
        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'QURAN',
            surahNumber: surah.number,
          }),
        });
        hasRecordedHistory.current = true;
      } catch {
        // Silent fail - user might not be logged in
      }
    };
    
    recordHistory();
  }, [surah.number]);

  // Initialize sidebar state from localStorage or default to OPEN for new users
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    
    // Initialize sidebar state - defer to avoid lint warning about synchronous setState
    const initSidebarState = () => {
      const saved = getSavedSidebarState();
      if (saved !== null) {
        // User has explicitly set a preference, use it
        return saved;
      } else {
        // First-time user: ALWAYS open sidebar so they know it exists
        return true;
      }
    };
    
    // Use requestAnimationFrame to defer the state update
    requestAnimationFrame(() => {
      setSidebarOpen(initSidebarState());
    });
  }, []);

  // Handle responsive sidebar (only if not manually set)
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      // Only auto-close on mobile if user hasn't explicitly set state
      if (window.innerWidth < 1024 && sidebarOpen === true) {
        const saved = getSavedSidebarState();
        if (saved === null) {
          setSidebarOpen(false);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Toggle sidebar and persist state
  const handleSidebarToggle = useCallback(() => {
    setSidebarOpen((prev) => {
      const newState = !prev;
      saveSidebarState(newState);
      return newState;
    });
  }, []);

  // Show loading until sidebar state is initialized
  if (sidebarOpen === null) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      {/* Surah Sidebar */}
      <SurahSidebar
        isOpen={sidebarOpen}
        onToggle={handleSidebarToggle}
        currentSurah={surah.number}
      />

      {/* Main Content */}
      <main
        className="flex-1"
        style={{
          marginLeft: isDesktop && sidebarOpen ? "320px" : "0",
          transition: "margin-left 400ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
          {/* Surah Header */}
          <section className="border-b border-[var(--gold)]/20 bg-[var(--background)] py-8 sm:py-10">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              {/* Surah Title */}
              <div className="text-center">
                {/* Surah Number Badge */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 px-4 py-1">
                  <span className="text-xs font-medium text-[var(--gold)]">
                    Surah {surah.number}
                  </span>
                  <span className="text-xs text-[var(--foreground-muted)]">•</span>
                  <span className="text-xs text-[var(--foreground-muted)]">
                    {surahMeta.revelationType}
                  </span>
                  <span className="text-xs text-[var(--foreground-muted)]">•</span>
                  <span className="text-xs text-[var(--foreground-muted)]">
                    {surah.numberOfAyahs} Verses
                  </span>
                </div>

                {/* Arabic Name */}
                <h1 className="arabic-text text-4xl text-[var(--gold)] sm:text-5xl">
                  {surah.name}
                </h1>

                {/* English Name */}
                <h2 className="mt-3 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
                  {surah.englishName}
                </h2>

                {/* Meaning */}
                <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                  {surah.englishNameTranslation}
                </p>
              </div>
            </div>
          </section>

          {/* Verses */}
          <SurahReader
            surah={surah}
            translations={translations}
            currentTranslation={currentTranslation}
          />

          {/* Navigation */}
          <section className="border-t border-[var(--gold)]/20 bg-[var(--background)] py-6">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4">
                {/* Previous Surah */}
                {prevSurah ? (
                  <Link
                    href={`/quran/${prevSurah.number}`}
                    className="group flex items-center gap-3 rounded-lg border border-[var(--gold)]/20 px-3 py-2 transition-all hover:border-[var(--gold)]/40 hover:bg-[var(--background-secondary)] sm:px-4 sm:py-3"
                  >
                    <span className="text-[var(--gold)]">←</span>
                    <div>
                      <p className="hidden text-xs text-[var(--foreground-muted)] sm:block">
                        Previous
                      </p>
                      <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--gold)]">
                        {prevSurah.englishName}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {/* Next Surah */}
                {nextSurah ? (
                  <Link
                    href={`/quran/${nextSurah.number}`}
                    className="group flex items-center gap-3 rounded-lg border border-[var(--gold)]/20 px-3 py-2 transition-all hover:border-[var(--gold)]/40 hover:bg-[var(--background-secondary)] sm:px-4 sm:py-3"
                  >
                    <div className="text-right">
                      <p className="hidden text-xs text-[var(--foreground-muted)] sm:block">
                        Next
                      </p>
                      <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--gold)]">
                        {nextSurah.englishName}
                      </p>
                    </div>
                    <span className="text-[var(--gold)]">→</span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
  );
}
