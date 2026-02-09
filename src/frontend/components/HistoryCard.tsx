/**
 * History Card Component
 * 
 * Displays a single reading history entry with progress
 * 
 * @module components/HistoryCard
 */

'use client';

import Link from 'next/link';

/**
 * Surah names mapping for display
 */
const SURAH_NAMES: Record<number, { arabic: string; english: string; transliteration: string }> = {
  1: { arabic: 'الفاتحة', english: 'The Opening', transliteration: 'Al-Fatihah' },
  2: { arabic: 'البقرة', english: 'The Cow', transliteration: 'Al-Baqarah' },
  3: { arabic: 'آل عمران', english: 'Family of Imran', transliteration: 'Ali Imran' },
  4: { arabic: 'النساء', english: 'The Women', transliteration: 'An-Nisa' },
  5: { arabic: 'المائدة', english: 'The Table Spread', transliteration: 'Al-Ma\'idah' },
  6: { arabic: 'الأنعام', english: 'The Cattle', transliteration: 'Al-An\'am' },
  7: { arabic: 'الأعراف', english: 'The Heights', transliteration: 'Al-A\'raf' },
  8: { arabic: 'الأنفال', english: 'The Spoils of War', transliteration: 'Al-Anfal' },
  9: { arabic: 'التوبة', english: 'The Repentance', transliteration: 'At-Tawbah' },
  10: { arabic: 'يونس', english: 'Jonah', transliteration: 'Yunus' },
  // Additional surahs would be added in production
};

/**
 * Hadith collection names mapping
 */
const COLLECTION_NAMES: Record<string, string> = {
  'bukhari': 'Sahih al-Bukhari',
  'muslim': 'Sahih Muslim',
  'abudawud': 'Sunan Abu Dawud',
  'tirmidhi': 'Jami at-Tirmidhi',
  'nasai': 'Sunan an-Nasai',
  'ibnmajah': 'Sunan Ibn Majah',
  'malik': 'Muwatta Malik',
  'ahmad': 'Musnad Ahmad',
};

/**
 * History entry interface matching API response
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
 * Props for HistoryCard component
 */
interface HistoryCardProps {
  entry: HistoryEntry;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

/**
 * Formats a date to a relative string
 */
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Progress bar component
 */
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[var(--card-border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--gold)] to-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <span className="text-xs text-[var(--foreground-muted)] min-w-[2.5rem] text-right">
        {Math.round(progress)}%
      </span>
    </div>
  );
}

/**
 * HistoryCard Component
 * 
 * Displays reading history entry with progress and continue reading link
 */
export function HistoryCard({ entry, onDelete, isDeleting }: HistoryCardProps) {
  const isQuran = entry.type === 'QURAN';
  
  // Build title and URL based on type
  const surahInfo = entry.surahNumber ? SURAH_NAMES[entry.surahNumber] : null;
  const title = isQuran
    ? `Surah ${surahInfo?.transliteration || entry.surahNumber}`
    : `${COLLECTION_NAMES[entry.collectionId || ''] || entry.collectionId}`;
  
  const subtitle = isQuran
    ? entry.ayahNumber ? `Last read: Ayah ${entry.ayahNumber}` : 'In progress'
    : entry.hadithNumber ? `Book ${entry.bookNumber || 1}, Hadith #${entry.hadithNumber}` : 'In progress';
  
  const url = isQuran
    ? `/quran/${entry.surahNumber}${entry.ayahNumber ? `#ayah-${entry.ayahNumber}` : ''}`
    : `/hadith/${entry.collectionId}/${entry.hadithNumber || 1}`;

  return (
    <div className="group bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-4 hover:border-[var(--gold)]/30 transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isQuran ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
        }`}>
          <span className="text-2xl">{isQuran ? '📖' : '📜'}</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
                {title}
              </h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                {subtitle}
              </p>
            </div>
            
            <span className="text-xs text-[var(--foreground-muted)]/60 flex-shrink-0">
              {formatTimeAgo(entry.lastReadAt)}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <ProgressBar progress={entry.progress} />
          </div>
          
          {/* Actions */}
          <div className="mt-3 flex items-center justify-between">
            <Link
              href={url}
              className="text-sm font-medium text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors flex items-center gap-1"
            >
              Continue Reading
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            {onDelete && (
              <button
                onClick={() => onDelete(entry.id)}
                disabled={isDeleting}
                className="opacity-0 group-hover:opacity-100 text-xs text-[var(--foreground-muted)] hover:text-red-400 transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Removing...' : 'Remove'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Continue Reading Card - Featured card for last reading position
 */
interface ContinueReadingCardProps {
  type: 'quran' | 'hadith';
  title: string;
  subtitle: string;
  progress: number;
  url: string;
  lastReadAt: string;
}

export function ContinueReadingCard({ type, title, subtitle, progress, url, lastReadAt }: ContinueReadingCardProps) {
  const isQuran = type === 'quran';
  
  return (
    <Link
      href={url}
      className="block bg-gradient-to-br from-[var(--card-bg)] to-[var(--gold)]/5 rounded-xl border border-[var(--gold)]/20 p-6 hover:border-[var(--gold)]/40 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
          isQuran ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
        }`}>
          <span className="text-3xl">{isQuran ? '📖' : '📜'}</span>
        </div>
        
        <div className="flex-1">
          <p className="text-xs text-[var(--gold)] font-medium uppercase tracking-wide mb-1">
            Continue {isQuran ? 'Quran' : 'Hadith'}
          </p>
          <h3 className="font-semibold text-lg text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {subtitle}
          </p>
          
          <div className="mt-4">
            <ProgressBar progress={progress} />
          </div>
          
          <p className="text-xs text-[var(--foreground-muted)]/60 mt-2">
            Last read {formatTimeAgo(lastReadAt)}
          </p>
        </div>
        
        <svg className="w-6 h-6 text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

/**
 * History filters
 */
interface HistoryFiltersProps {
  activeFilter: 'all' | 'QURAN' | 'HADITH';
  onFilterChange: (filter: 'all' | 'QURAN' | 'HADITH') => void;
}

export function HistoryFilters({ activeFilter, onFilterChange }: HistoryFiltersProps) {
  const filters = [
    { key: 'all' as const, label: 'All' },
    { key: 'QURAN' as const, label: 'Quran', icon: '📖' },
    { key: 'HADITH' as const, label: 'Hadith', icon: '📜' },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeFilter === filter.key
              ? 'bg-[var(--gold)] text-black'
              : 'bg-[var(--card-bg)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--card-border)]'
          }`}
        >
          {filter.icon && <span>{filter.icon}</span>}
          {filter.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Empty state when no history
 */
export function HistoryEmpty() {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-12 border border-[var(--card-border)] text-center">
      <div className="text-5xl mb-4">📜</div>
      <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
        No Reading History
      </h2>
      <p className="text-[var(--foreground-muted)] max-w-md mx-auto mb-6">
        Your reading history will appear here as you explore the Quran and Hadith collections.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/quran"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          📖 Start Reading Quran
        </Link>
        <Link
          href="/hadith"
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          📜 Explore Hadith
        </Link>
      </div>
    </div>
  );
}
