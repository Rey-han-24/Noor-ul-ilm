/**
 * Bookmark Card Component
 * 
 * Displays a single bookmark with actions
 * 
 * @module components/BookmarkCard
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
 * Bookmark interface matching API response
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
 * Props for BookmarkCard component
 */
interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

/**
 * Formats a date to a relative or absolute string
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * BookmarkCard Component
 * 
 * Displays bookmark with link, metadata, and delete action
 */
export function BookmarkCard({ bookmark, onDelete, isDeleting }: BookmarkCardProps) {
  const isQuran = bookmark.type === 'QURAN';
  
  // Build title and URL based on type
  const title = isQuran
    ? `Surah ${SURAH_NAMES[bookmark.surahNumber || 0]?.transliteration || bookmark.surahNumber} : Ayah ${bookmark.ayahNumber}`
    : `${COLLECTION_NAMES[bookmark.collectionId || ''] || bookmark.collectionId} - Hadith #${bookmark.hadithNumber}`;
  
  const arabicTitle = isQuran && bookmark.surahNumber
    ? SURAH_NAMES[bookmark.surahNumber]?.arabic
    : null;
  
  const url = isQuran
    ? `/quran/${bookmark.surahNumber}#ayah-${bookmark.ayahNumber}`
    : `/hadith/${bookmark.collectionId}/${bookmark.hadithNumber}`;

  return (
    <div className="group bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-4 hover:border-[var(--gold)]/30 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        {/* Content */}
        <Link href={url} className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {/* Type Icon */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isQuran ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
              {isQuran ? '📖' : '📜'}
            </div>
            
            {/* Title */}
            <div className="min-w-0">
              <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors truncate">
                {title}
              </h3>
              {arabicTitle && (
                <p className="text-sm text-[var(--foreground-muted)] font-amiri" dir="rtl">
                  {arabicTitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Note */}
          {bookmark.note && (
            <p className="text-sm text-[var(--foreground-muted)] mt-2 line-clamp-2 ml-13">
              &ldquo;{bookmark.note}&rdquo;
            </p>
          )}
          
          {/* Date */}
          <p className="text-xs text-[var(--foreground-muted)]/60 mt-2 ml-13">
            Saved {formatDate(bookmark.createdAt)}
          </p>
        </Link>
        
        {/* Delete Button */}
        <button
          onClick={() => onDelete(bookmark.id)}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 p-2 text-[var(--foreground-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
          title="Remove bookmark"
        >
          {isDeleting ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * Bookmark type filter tabs
 */
interface BookmarkFiltersProps {
  activeFilter: 'all' | 'QURAN' | 'HADITH';
  onFilterChange: (filter: 'all' | 'QURAN' | 'HADITH') => void;
  counts: { all: number; quran: number; hadith: number };
}

export function BookmarkFilters({ activeFilter, onFilterChange, counts }: BookmarkFiltersProps) {
  const filters = [
    { key: 'all' as const, label: 'All', count: counts.all },
    { key: 'QURAN' as const, label: 'Quran', count: counts.quran, icon: '📖' },
    { key: 'HADITH' as const, label: 'Hadith', count: counts.hadith, icon: '📜' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
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
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeFilter === filter.key
              ? 'bg-black/20'
              : 'bg-[var(--gold)]/10 text-[var(--gold)]'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
}

/**
 * Empty state when no bookmarks
 */
export function BookmarksEmpty({ type }: { type: 'all' | 'QURAN' | 'HADITH' }) {
  const messages = {
    all: 'Save your favorite verses and hadiths while reading to access them quickly here.',
    QURAN: 'No Quran verses bookmarked yet. Start reading and save your favorite ayahs!',
    HADITH: 'No hadith bookmarked yet. Explore collections and save meaningful narrations!',
  };

  return (
    <div className="bg-[var(--card-bg)] rounded-xl p-12 border border-[var(--card-border)] text-center">
      <div className="text-5xl mb-4">🔖</div>
      <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
        No Bookmarks Yet
      </h2>
      <p className="text-[var(--foreground-muted)] max-w-md mx-auto mb-6">
        {messages[type]}
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/quran"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          📖 Read Quran
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
