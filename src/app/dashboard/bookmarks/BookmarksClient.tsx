/**
 * Bookmarks Page Client Component
 * 
 * Client-side bookmarks list with filtering and deletion
 * 
 * @module dashboard/bookmarks
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookmarkCard, BookmarkFilters, BookmarksEmpty } from '@/frontend/components/BookmarkCard';

/**
 * Bookmark interface matching API
 */
interface Bookmark {
  id: string;
  type: 'QURAN' | 'HADITH';
  surahNumber: number | null;
  ayahNumber: number | null;
  collectionId: string | null;
  hadithNumber: number | null;
  note: string | null;
  createdAt: string;
}

/**
 * Pagination interface
 */
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * BookmarksClient Component
 * 
 * Fetches and displays user bookmarks with filtering
 */
export default function BookmarksClient() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filter, setFilter] = useState<'all' | 'QURAN' | 'HADITH'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch bookmarks from API
   */
  const fetchBookmarks = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (filter !== 'all') {
        params.set('type', filter);
      }
      
      const response = await fetch(`/api/bookmarks?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bookmarks');
      }
      
      setBookmarks(data.data.bookmarks);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  /**
   * Delete a bookmark
   */
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      
      const response = await fetch(`/api/bookmarks?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete bookmark');
      }
      
      // Remove from local state
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      
      // Update pagination total
      if (pagination) {
        setPagination({
          ...pagination,
          total: pagination.total - 1,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (newFilter: 'all' | 'QURAN' | 'HADITH') => {
    setFilter(newFilter);
  };

  /**
   * Calculate counts for filters
   */
  const counts = {
    all: pagination?.total || 0,
    quran: bookmarks.filter((b) => b.type === 'QURAN').length,
    hadith: bookmarks.filter((b) => b.type === 'HADITH').length,
  };

  // Fetch on mount and filter change
  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <span className="text-[var(--gold)]">✦</span> Bookmarks
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            {pagination?.total || 0} saved items
          </p>
        </div>
        
        <BookmarkFilters
          activeFilter={filter}
          onFilterChange={handleFilterChange}
          counts={counts}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          <p className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-4 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--card-border)]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[var(--card-border)] rounded w-1/3" />
                  <div className="h-3 bg-[var(--card-border)] rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && bookmarks.length === 0 && (
        <BookmarksEmpty type={filter} />
      )}

      {/* Bookmarks List */}
      {!isLoading && bookmarks.length > 0 && (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={handleDelete}
              isDeleting={deletingId === bookmark.id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => fetchBookmarks(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--gold)]/30 transition-colors"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-[var(--foreground-muted)]">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => fetchBookmarks(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--gold)]/30 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
