/**
 * SurahSidebar Component
 * 
 * A toggleable sidebar panel containing all 114 Surahs.
 * Opens by default, can be collapsed with a toggle button.
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SURAH_LIST } from "@/types/quran";

interface SurahSidebarProps {
  /** Whether sidebar is open */
  isOpen: boolean;
  /** Callback to toggle sidebar */
  onToggle: () => void;
  /** Currently selected surah number */
  currentSurah?: number;
}

export default function SurahSidebar({ isOpen, onToggle, currentSurah }: SurahSidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter surahs based on search
  const filteredSurahs = SURAH_LIST.filter((surah) => {
    const query = searchQuery.toLowerCase();
    return (
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.number.toString().includes(query) ||
      surah.name.includes(searchQuery)
    );
  });

  return (
    <>
      {/* Animated Backdrop for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          transition: "opacity 300ms ease-in-out",
        }}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-80 flex-col border-r border-[var(--gold)]/20 bg-[var(--background)] pt-16 shadow-2xl lg:pt-[73px] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          transition: "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Sidebar Header */}
        <div className="flex-shrink-0 border-b border-[var(--gold)]/20 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Surahs
            </h2>
            <button
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--gold)]/30 text-[var(--gold)] transition-colors hover:bg-[var(--gold)]/10"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* Search Input */}
          <div className="mt-3">
            <input
              type="text"
              placeholder="Search Surah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[var(--gold)]/20 bg-[var(--background-secondary)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
            />
          </div>

          {/* Quick Stats */}
          <div className="mt-3 flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
            <span>114 Surahs</span>
            <span className="text-[var(--gold)]">•</span>
            <span>6,236 Verses</span>
          </div>
        </div>

        {/* Surah List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {filteredSurahs.map((surah) => {
              const isActive = currentSurah === surah.number;
              return (
                <Link
                  key={surah.number}
                  href={`/quran/${surah.number}`}
                  className={`group mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                    isActive
                      ? "bg-[var(--gold)]/15 border border-[var(--gold)]/40"
                      : "border border-transparent hover:bg-[var(--background-secondary)] hover:border-[var(--gold)]/20"
                  }`}
                >
                  {/* Surah Number */}
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                      isActive
                        ? "bg-[var(--gold)] text-[var(--primary)]"
                        : "border border-[var(--gold)]/30 bg-[var(--gold)]/5 text-[var(--gold)]"
                    }`}
                  >
                    {surah.number}
                  </div>

                  {/* Surah Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`truncate text-sm font-medium ${
                          isActive ? "text-[var(--gold)]" : "text-[var(--foreground)]"
                        }`}
                      >
                        {surah.englishName}
                      </span>
                      <span className="arabic-text flex-shrink-0 text-sm text-[var(--gold)]">
                        {surah.name}
                      </span>
                    </div>
                    <p className="truncate text-xs text-[var(--foreground-muted)]">
                      {surah.englishNameTranslation} • {surah.numberOfAyahs} verses
                    </p>
                  </div>
                </Link>
              );
            })}

            {filteredSurahs.length === 0 && (
              <p className="py-8 text-center text-sm text-[var(--foreground-muted)]">
                No Surahs found
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Toggle Button - Always visible when closed */}
      <button
        onClick={onToggle}
        className={`fixed left-0 top-1/2 z-40 -translate-y-1/2 rounded-r-lg border border-l-0 border-[var(--gold)]/30 bg-[var(--background)] px-2 py-4 text-[var(--gold)] shadow-lg hover:bg-[var(--gold)]/10 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          transition: "opacity 300ms ease-in-out, background-color 200ms ease",
        }}
        aria-label="Open Surah list"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </>
  );
}
