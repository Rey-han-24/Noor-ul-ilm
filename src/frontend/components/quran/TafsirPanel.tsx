/**
 * TafsirPanel Component
 * 
 * Displays Quran commentary (tafsir) for a specific ayah.
 * Features:
 * - Expandable/collapsible tafsir text per verse
 * - Multiple tafsir source selector
 * - Supports English, Arabic and Urdu tafsirs
 * - Loading and error states
 * - HTML formatting support from API
 * - Responsive design with royal theme
 * 
 * @module frontend/components/quran/TafsirPanel
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  TafsirContent, 
  TAFSIR_SOURCES, 
  DEFAULT_TAFSIR_ID,
  getEnglishTafsirs,
  getArabicTafsirs,
  getUrduTafsirs,
} from '@/shared/types/tafsir';
import { sanitizeTafsirHtml } from '@/backend/services/tafsir-api';

/**
 * Props for TafsirPanel
 */
interface TafsirPanelProps {
  surahNumber: number;
  ayahNumber: number;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * TafsirPanel - Renders tafsir content for a verse
 */
export default function TafsirPanel({
  surahNumber,
  ayahNumber,
  isOpen,
  onClose,
}: TafsirPanelProps) {
  const [tafsir, setTafsir] = useState<TafsirContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTafsirId, setSelectedTafsirId] = useState<number>(DEFAULT_TAFSIR_ID);
  const [showFullText, setShowFullText] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const englishTafsirs = getEnglishTafsirs();
  const arabicTafsirs = getArabicTafsirs();
  const urduTafsirs = getUrduTafsirs();

  const selectedSource = TAFSIR_SOURCES.find(t => t.id === selectedTafsirId);

  /**
   * Fetch tafsir when panel opens or source changes
   */
  const fetchTafsir = useCallback(async () => {
    if (!isOpen) return;
    
    setLoading(true);
    setError(null);
    setShowFullText(false);

    try {
      const response = await fetch(
        `/api/quran/tafsir?surah=${surahNumber}&ayah=${ayahNumber}&tafsirId=${selectedTafsirId}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch tafsir');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setTafsir(data.data);
      } else {
        setError('No tafsir available for this verse.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tafsir. Please try again.');
      console.error('Tafsir fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [isOpen, surahNumber, ayahNumber, selectedTafsirId]);

  useEffect(() => {
    fetchTafsir();
  }, [fetchTafsir]);

  // Scroll panel into view when opened
  useEffect(() => {
    if (isOpen && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="mt-4 overflow-hidden rounded-lg border border-[var(--gold)]/30 bg-[var(--background-secondary)]"
      style={{ animation: 'slideDown 200ms ease-out' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📖</span>
          <h3 className="text-sm font-semibold text-[var(--gold)]">
            Tafsir — {surahNumber}:{ayahNumber}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Tafsir Source Selector */}
          <select
            value={selectedTafsirId}
            onChange={(e) => setSelectedTafsirId(parseInt(e.target.value, 10))}
            className="rounded border border-[var(--gold)]/30 bg-[var(--background)] px-2 py-1 text-xs text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
            aria-label="Select tafsir source"
          >
            {englishTafsirs.length > 0 && (
              <optgroup label="🇬🇧 English">
                {englishTafsirs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            )}
            {arabicTafsirs.length > 0 && (
              <optgroup label="🇸🇦 Arabic">
                {arabicTafsirs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            )}
            {urduTafsirs.length > 0 && (
              <optgroup label="🇵🇰 Urdu">
                {urduTafsirs.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="rounded-full p-1 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--gold)]/10 hover:text-[var(--gold)]"
            aria-label="Close tafsir"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Source Info */}
      {selectedSource && (
        <div className="border-b border-[var(--gold)]/10 px-4 py-2">
          <p className="text-xs text-[var(--foreground-muted)]">
            <span className="font-medium text-[var(--gold)]">{selectedSource.author}</span>
            {' — '}
            {selectedSource.description}
          </p>
        </div>
      )}

      {/* Content Area */}
      <div className="px-4 py-4">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-8">
            <svg className="h-5 w-5 animate-spin text-[var(--gold)]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm text-[var(--foreground-muted)]">Loading tafsir...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center gap-3 py-6">
            <span className="text-2xl">⚠️</span>
            <p className="text-center text-sm text-[var(--foreground-muted)]">{error}</p>
            <button
              onClick={fetchTafsir}
              className="rounded-lg border border-[var(--gold)]/30 px-4 py-1.5 text-xs text-[var(--gold)] transition-colors hover:bg-[var(--gold)]/10"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tafsir Content */}
        {tafsir && !loading && !error && (
          <div>
            <div
              className={`tafsir-content prose prose-sm max-w-none text-[var(--foreground)] ${
                selectedSource?.language === 'ar' ? 'arabic-text text-right' : ''
              } ${selectedSource?.language === 'ur' ? 'text-right' : ''} ${
                !showFullText ? 'max-h-[300px] overflow-hidden' : ''
              }`}
              style={{
                direction: selectedSource?.language === 'ar' || selectedSource?.language === 'ur' ? 'rtl' : 'ltr',
              }}
              dangerouslySetInnerHTML={{ 
                __html: sanitizeTafsirHtml(tafsir.text) 
              }}
            />

            {/* Gradient overlay and Show More button */}
            {!showFullText && tafsir.text.length > 500 && (
              <div className="relative">
                <div className="absolute -top-16 left-0 right-0 h-16 bg-gradient-to-t from-[var(--background-secondary)] to-transparent" />
                <button
                  onClick={() => setShowFullText(true)}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-[var(--gold)]/20 py-2 text-xs font-medium text-[var(--gold)] transition-colors hover:bg-[var(--gold)]/10"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  Show Full Tafsir
                </button>
              </div>
            )}

            {/* Show Less button */}
            {showFullText && tafsir.text.length > 500 && (
              <button
                onClick={() => setShowFullText(false)}
                className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-[var(--gold)]/20 py-2 text-xs font-medium text-[var(--gold)] transition-colors hover:bg-[var(--gold)]/10"
              >
                <svg className="h-3.5 w-3.5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                Show Less
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
