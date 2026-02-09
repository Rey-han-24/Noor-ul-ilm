/**
 * Content Actions Hooks
 * 
 * Custom hooks for managing bookmarks and reading history
 * 
 * @module hooks/useContentActions
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// ============================================
// TYPES
// ============================================

type ContentType = 'QURAN' | 'HADITH';

interface BookmarkData {
  type: ContentType;
  surahNumber?: number;
  ayahNumber?: number;
  collectionId?: string;
  hadithNumber?: number;
  note?: string;
}

interface HistoryData {
  type: ContentType;
  surahNumber?: number;
  ayahNumber?: number;
  collectionId?: string;
  bookNumber?: number;
  hadithNumber?: number;
  progress?: number;
}

// ============================================
// BOOKMARK HOOK
// ============================================

/**
 * Hook to manage bookmark functionality
 * 
 * @param initialBookmarkData - The content data to check/toggle bookmark
 * @returns Bookmark state and actions
 */
export function useBookmarks(initialBookmarkData?: BookmarkData) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if current content is bookmarked
   */
  const checkBookmarkStatus = useCallback(async (data: BookmarkData) => {
    try {
      const params = new URLSearchParams({ type: data.type });
      
      if (data.type === 'QURAN' && data.surahNumber) {
        params.set('surahNumber', data.surahNumber.toString());
        if (data.ayahNumber) params.set('ayahNumber', data.ayahNumber.toString());
      } else if (data.type === 'HADITH' && data.collectionId) {
        params.set('collectionId', data.collectionId);
        if (data.hadithNumber) params.set('hadithNumber', data.hadithNumber.toString());
      }

      const response = await fetch(`/api/bookmarks?${params}`);
      if (response.ok) {
        const result = await response.json();
        const bookmarks = result.data?.bookmarks || [];
        
        // Check if this specific content is bookmarked
        const found = bookmarks.some((b: BookmarkData) => {
          if (data.type === 'QURAN') {
            return b.surahNumber === data.surahNumber && 
                   (!data.ayahNumber || b.ayahNumber === data.ayahNumber);
          } else {
            return b.collectionId === data.collectionId && 
                   (!data.hadithNumber || b.hadithNumber === data.hadithNumber);
          }
        });
        
        setIsBookmarked(found);
      }
    } catch {
      // Silent fail - user might not be logged in
    }
  }, []);

  /**
   * Toggle bookmark for the current content
   */
  const toggleBookmark = useCallback(async (data: BookmarkData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (isBookmarked) {
        // Need to find and delete the bookmark
        const params = new URLSearchParams({ type: data.type });
        if (data.type === 'QURAN' && data.surahNumber) {
          params.set('surahNumber', data.surahNumber.toString());
        } else if (data.type === 'HADITH' && data.collectionId) {
          params.set('collectionId', data.collectionId);
        }

        // Get the bookmark ID first
        const listResponse = await fetch(`/api/bookmarks?${params}`);
        if (listResponse.ok) {
          const result = await listResponse.json();
          const bookmarks = result.data?.bookmarks || [];
          
          const bookmark = bookmarks.find((b: BookmarkData & { id?: string }) => {
            if (data.type === 'QURAN') {
              return b.surahNumber === data.surahNumber;
            } else {
              return b.collectionId === data.collectionId && 
                     b.hadithNumber === data.hadithNumber;
            }
          });

          if (bookmark?.id) {
            const deleteResponse = await fetch(`/api/bookmarks?id=${bookmark.id}`, {
              method: 'DELETE',
            });
            
            if (deleteResponse.ok) {
              setIsBookmarked(false);
              return true;
            }
          }
        }
      } else {
        // Create new bookmark
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          setIsBookmarked(true);
          return true;
        } else if (response.status === 401) {
          setError('Please log in to save bookmarks');
        } else if (response.status === 409) {
          setIsBookmarked(true); // Already bookmarked
          return true;
        } else {
          const result = await response.json();
          setError(result.error || 'Failed to save bookmark');
        }
      }
    } catch {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }

    return false;
  }, [isBookmarked]);

  // Check initial bookmark status
  useEffect(() => {
    if (initialBookmarkData) {
      checkBookmarkStatus(initialBookmarkData);
    }
  }, [initialBookmarkData, checkBookmarkStatus]);

  return {
    isBookmarked,
    isLoading,
    error,
    toggleBookmark,
    checkBookmarkStatus,
    setIsBookmarked,
  };
}

// ============================================
// READING HISTORY HOOK
// ============================================

/**
 * Hook to record reading history
 * 
 * @param historyData - The content data to record
 * @param autoRecord - Whether to auto-record on mount (default: true)
 * @returns History recording actions
 */
export function useReadingHistory(historyData?: HistoryData, autoRecord = true) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  /**
   * Record reading activity
   */
  const recordHistory = useCallback(async (data: HistoryData): Promise<boolean> => {
    if (isRecording) return false;
    
    setIsRecording(true);

    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setHasRecorded(true);
        return true;
      }
    } catch {
      // Silent fail - user might not be logged in
    } finally {
      setIsRecording(false);
    }

    return false;
  }, [isRecording]);

  /**
   * Update reading progress
   */
  const updateProgress = useCallback(async (data: HistoryData, progress: number): Promise<boolean> => {
    return recordHistory({ ...data, progress });
  }, [recordHistory]);

  // Auto-record on mount if enabled
  useEffect(() => {
    if (autoRecord && historyData && !hasRecorded) {
      recordHistory(historyData);
    }
  }, [autoRecord, historyData, hasRecorded, recordHistory]);

  return {
    isRecording,
    hasRecorded,
    recordHistory,
    updateProgress,
  };
}

// ============================================
// COMBINED HOOK
// ============================================

/**
 * Combined hook for both bookmarks and history
 */
export function useContentActions(contentData: BookmarkData & HistoryData, autoRecordHistory = true) {
  const bookmarks = useBookmarks(contentData);
  const history = useReadingHistory(contentData, autoRecordHistory);

  return {
    // Bookmark actions
    isBookmarked: bookmarks.isBookmarked,
    bookmarkLoading: bookmarks.isLoading,
    bookmarkError: bookmarks.error,
    toggleBookmark: () => bookmarks.toggleBookmark(contentData),
    
    // History actions
    isRecordingHistory: history.isRecording,
    hasRecordedHistory: history.hasRecorded,
    recordHistory: () => history.recordHistory(contentData),
    updateProgress: (progress: number) => history.updateProgress(contentData, progress),
  };
}
