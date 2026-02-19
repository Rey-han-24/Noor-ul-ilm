/**
 * Browse All Hadiths Client Component
 * 
 * Client-side component for browsing all hadiths in a collection.
 * Features infinite scroll / pagination for thousands of hadiths.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Hadith } from "@/shared/types/hadith";
import HadithCard from "@/frontend/components/hadith/HadithCard";

interface BrowseAllClientProps {
  collectionId: string;
  collectionName: string;
  initialPage: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  lastPage: number;
  hasMore: boolean;
}

export default function BrowseAllClient({
  collectionId,
  collectionName,
  initialPage,
}: BrowseAllClientProps) {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showArabic, setShowArabic] = useState(true);

  // Fetch hadiths for current page
  const fetchHadiths = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/hadith/${collectionId}/hadiths?page=${page}&limit=25`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch hadiths");
      }

      const data = await response.json();
      
      if (data.success) {
        setHadiths(data.data);
        setPagination(data.pagination);
        setCurrentPage(page);
        
        // Update URL without reload
        const url = new URL(window.location.href);
        url.searchParams.set("page", page.toString());
        window.history.pushState({}, "", url.toString());
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load hadiths");
    } finally {
      setIsLoading(false);
    }
  }, [collectionId]);

  // Initial load
  useEffect(() => {
    fetchHadiths(initialPage);
  }, [initialPage, fetchHadiths]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (pagination && newPage > pagination.lastPage)) return;
    fetchHadiths(newPage);
  };

  // Jump to page
  const [jumpToPage, setJumpToPage] = useState("");
  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage, 10);
    if (!isNaN(page) && page >= 1 && pagination && page <= pagination.lastPage) {
      handlePageChange(page);
      setJumpToPage("");
    }
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[var(--gold)]/20 bg-[var(--background-secondary)] p-4">
          <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
            {pagination && (
              <>
                <span>{pagination.total.toLocaleString()} Hadiths</span>
                <span className="text-xs">
                  Page {currentPage} of {pagination.lastPage.toLocaleString()}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Jump to page */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Page #"
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJumpToPage()}
                className="w-20 rounded-lg border border-[var(--gold)]/30 bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)]"
                min={1}
                max={pagination?.lastPage || 1}
              />
              <button
                onClick={handleJumpToPage}
                className="rounded-lg border border-[var(--gold)]/30 px-3 py-1.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--gold)]/10"
              >
                Go
              </button>
            </div>

            {/* Toggle Arabic */}
            <button
              onClick={() => setShowArabic(!showArabic)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                showArabic
                  ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--primary)]"
                  : "border-[var(--gold)]/30 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--primary)]"
              }`}
            >
              {showArabic ? "✓ Arabic On" : "Arabic Off"}
            </button>
          </div>
        </div>

        {/* Back link */}
        <div className="mb-6">
          <Link
            href={`/hadith/${collectionId}`}
            className="text-sm text-[var(--gold)] hover:underline"
          >
            ← Back to Chapters
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-[var(--gold)] border-t-transparent"></div>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => fetchHadiths(currentPage)}
              className="mt-4 rounded-lg bg-[var(--gold)] px-4 py-2 text-sm font-medium text-[var(--primary)]"
            >
              Retry
            </button>
          </div>
        )}

        {/* Hadiths list */}
        {!isLoading && !error && hadiths.length > 0 && (
          <div className="space-y-6">
            {hadiths.map((hadith) => (
              <HadithCard
                key={`${collectionId}-${hadith.hadithNumber}`}
                hadith={hadith}
                collectionId={collectionId}
                collectionName={collectionName}
                isBookmarked={false}
                onBookmark={() => {}}
                showArabicGlobal={showArabic}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && hadiths.length === 0 && (
          <div className="rounded-xl border border-[var(--gold)]/20 bg-[var(--background-secondary)] p-8 text-center">
            <p className="text-[var(--foreground-muted)]">No hadiths found.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination && pagination.lastPage > 1 && !isLoading && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {/* First page */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage <= 1}
              className="rounded-lg border border-[var(--gold)]/30 px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--gold)]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ««
            </button>

            {/* Previous */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="rounded-lg border border-[var(--gold)]/30 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--gold)]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {generatePageNumbers(currentPage, pagination.lastPage).map((pageNum, idx) => (
                pageNum === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-[var(--foreground-muted)]">...</span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum as number)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-[var(--gold)] text-[var(--primary)]"
                        : "border border-[var(--gold)]/30 text-[var(--foreground)] hover:bg-[var(--gold)]/10"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pagination.lastPage}
              className="rounded-lg border border-[var(--gold)]/30 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--gold)]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>

            {/* Last page */}
            <button
              onClick={() => handlePageChange(pagination.lastPage)}
              disabled={currentPage >= pagination.lastPage}
              className="rounded-lg border border-[var(--gold)]/30 px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--gold)]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              »»
            </button>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 text-center text-xs text-[var(--foreground-muted)]">
          Source: HadithAPI.com (Verified)
        </div>
      </div>
    </section>
  );
}

/**
 * Generate page numbers for pagination
 */
function generatePageNumbers(current: number, total: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  
  if (total <= 7) {
    // Show all pages
    for (let i = 1; i <= total; i++) pages.push(i);
  } else if (current <= 4) {
    // Near start
    pages.push(1, 2, 3, 4, 5, "...", total);
  } else if (current >= total - 3) {
    // Near end
    pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    // Middle
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }
  
  return pages;
}
