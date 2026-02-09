/**
 * History Recorder Component
 * 
 * Client component that records reading history on mount
 * Use this in server components to track reading activity
 * 
 * @module components/HistoryRecorder
 */

'use client';

import { useEffect, useRef } from 'react';

interface HistoryRecorderProps {
  type: 'QURAN' | 'HADITH';
  surahNumber?: number;
  ayahNumber?: number;
  collectionId?: string;
  bookNumber?: number;
  hadithNumber?: number;
}

/**
 * Records reading history when mounted
 * This is a headless component - renders nothing
 */
export function HistoryRecorder({
  type,
  surahNumber,
  ayahNumber,
  collectionId,
  bookNumber,
  hadithNumber,
}: HistoryRecorderProps) {
  const hasRecorded = useRef(false);

  useEffect(() => {
    if (hasRecorded.current) return;

    const recordHistory = async () => {
      try {
        const data: Record<string, unknown> = { type };
        
        if (type === 'QURAN') {
          if (surahNumber) data.surahNumber = surahNumber;
          if (ayahNumber) data.ayahNumber = ayahNumber;
        } else if (type === 'HADITH') {
          if (collectionId) data.collectionId = collectionId;
          if (bookNumber) data.bookNumber = bookNumber;
          if (hadithNumber) data.hadithNumber = hadithNumber;
        }

        await fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        hasRecorded.current = true;
      } catch {
        // Silent fail - user might not be logged in
      }
    };

    recordHistory();
  }, [type, surahNumber, ayahNumber, collectionId, bookNumber, hadithNumber]);

  // This component renders nothing
  return null;
}

export default HistoryRecorder;
