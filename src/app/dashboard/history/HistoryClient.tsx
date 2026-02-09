/**
 * History Page Client Component
 * 
 * Client-side reading history with continue reading feature
 * 
 * @module dashboard/history
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { HistoryCard, HistoryFilters, HistoryEmpty, ContinueReadingCard } from '@/frontend/components/HistoryCard';

/**
 * History entry interface matching API
 */
interface HistoryEntry {
  id: string;
  type: 'QURAN' | 'HADITH';
  surahNumber: number | null;
  ayahNumber: number | null;
  collectionId: string | null;
  bookNumber: number | null;
  hadithNumber: number | null;
  progress: number;
  lastReadAt: string;
}

/**
 * Continue reading data interface
 */
interface ContinueReadingData {
  quran: {
    surahNumber: number;
    ayahNumber: number | null;
    surahName: { arabic: string; english: string; transliteration: string } | null;
    progress: number;
    lastReadAt: string;
    url: string;
  } | null;
  hadith: {
    collectionId: string;
    bookNumber: number | null;
    hadithNumber: number | null;
    collectionName: string | null;
    progress: number;
    lastReadAt: string;
    url: string;
  } | null;
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
 * HistoryClient Component
 * 
 * Fetches and displays user reading history with continue reading
 */
export default function HistoryClient() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [continueReading, setContinueReading] = useState<ContinueReadingData | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filter, setFilter] = useState<'all' | 'QURAN' | 'HADITH'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingContinue, setIsLoadingContinue] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch continue reading data
   */
  const fetchContinueReading = useCallback(async () => {
    try {
      setIsLoadingContinue(true);
      const response = await fetch('/api/history/continue');
      const data = await response.json();
      
      if (response.ok && data.success) {
        setContinueReading(data.data);
      }
    } catch {
      // Silently fail for continue reading
    } finally {
      setIsLoadingContinue(false);
    }
  }, []);

  /**
   * Fetch history from API
   */
  const fetchHistory = useCallback(async (page = 1) => {
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
      
      const response = await fetch(`/api/history?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch history');
      }
      
      setHistory(data.data.history);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  /**
   * Delete a history entry
   */
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      
      const response = await fetch(`/api/history?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete history entry');
      }
      
      // Remove from local state
      setHistory((prev) => prev.filter((h) => h.id !== id));
      
      // Update pagination total
      if (pagination) {
        setPagination({
          ...pagination,
          total: pagination.total - 1,
        });
      }
      
      // Refresh continue reading data
      fetchContinueReading();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Clear all history
   */
  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all reading history?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams({ clearAll: 'true' });
      if (filter !== 'all') {
        params.set('type', filter);
      }
      
      const response = await fetch(`/api/history?${params}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to clear history');
      }
      
      // Clear local state
      setHistory([]);
      setPagination(null);
      setContinueReading(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear history');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (newFilter: 'all' | 'QURAN' | 'HADITH') => {
    setFilter(newFilter);
  };

  // Fetch on mount and filter change
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Fetch continue reading on mount
  useEffect(() => {
    fetchContinueReading();
  }, [fetchContinueReading]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <span className="text-[var(--gold)]">✦</span> Reading History
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            Track your learning journey
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <HistoryFilters
            activeFilter={filter}
            onFilterChange={handleFilterChange}
          />
          
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Continue Reading Cards */}
      {!isLoadingContinue && continueReading && (continueReading.quran || continueReading.hadith) && (
        <div className="grid md:grid-cols-2 gap-4">
          {continueReading.quran && (
            <ContinueReadingCard
              type="quran"
              title={continueReading.quran.surahName?.transliteration || `Surah ${continueReading.quran.surahNumber}`}
              subtitle={continueReading.quran.ayahNumber ? `Continue from Ayah ${continueReading.quran.ayahNumber}` : 'Resume reading'}
              progress={continueReading.quran.progress}
              url={continueReading.quran.url}
              lastReadAt={continueReading.quran.lastReadAt}
            />
          )}
          
          {continueReading.hadith && (
            <ContinueReadingCard
              type="hadith"
              title={continueReading.hadith.collectionName || continueReading.hadith.collectionId}
              subtitle={continueReading.hadith.hadithNumber ? `Hadith #${continueReading.hadith.hadithNumber}` : 'Resume reading'}
              progress={continueReading.hadith.progress}
              url={continueReading.hadith.url}
              lastReadAt={continueReading.hadith.lastReadAt}
            />
          )}
        </div>
      )}

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

      {/* Recent History Section */}
      {!isLoading && history.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <span className="text-[var(--gold)]">📜</span> Recent Activity
          </h2>
          
          <div className="space-y-3">
            {history.map((entry) => (
              <HistoryCard
                key={entry.id}
                entry={entry}
                onDelete={handleDelete}
                isDeleting={deletingId === entry.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-4 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--card-border)]" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-[var(--card-border)] rounded w-1/3" />
                  <div className="h-3 bg-[var(--card-border)] rounded w-1/4" />
                  <div className="h-2 bg-[var(--card-border)] rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && history.length === 0 && (
        <HistoryEmpty />
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => fetchHistory(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--gold)]/30 transition-colors"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-[var(--foreground-muted)]">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => fetchHistory(pagination.page + 1)}
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
