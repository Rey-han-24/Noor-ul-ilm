/**
 * Search Page Client Component
 * 
 * Unified search across Quran and Hadith content.
 * Features:
 * - Real-time search suggestions
 * - Filter by content type (All, Quran, Hadith)
 * - Recent searches
 * - Highlighted results
 * 
 * NOTE: Header and Footer are rendered by the parent layout.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchResultCard } from "@/frontend/components/search/SearchResultCard";
import {
  SearchResult,
  SearchFilter,
  RecentSearch,
} from "@/shared/types/search";
import {
  search,
  getRecentSearches,
  saveRecentSearch,
  clearRecentSearches,
  getSearchSuggestions,
} from "@/backend/services/search-api";

/**
 * Filter tabs configuration
 */
const FILTER_TABS: { id: SearchFilter; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "🔍" },
  { id: "quran", label: "Quran", icon: "📖" },
  { id: "hadith", label: "Hadith", icon: "📜" },
];

/**
 * Search input component with suggestions
 */
function SearchInput({
  value,
  onChange,
  onSearch,
  suggestions,
  onSuggestionClick,
}: {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
                setShowSuggestions(false);
              }
            }}
            placeholder="Search Quran verses, Hadith, topics..."
            className="w-full rounded-xl border border-[var(--gold)]/30 bg-[var(--background-secondary)] px-5 py-4 pr-12 text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
          />
          {/* Search icon */}
          <svg
            className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--foreground-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          onClick={onSearch}
          className="rounded-xl bg-[var(--gold)] px-6 py-4 font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--gold-light)]"
        >
          Search
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-[var(--gold)]/20 bg-[var(--background)] p-2 shadow-xl">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onSuggestionClick(suggestion);
                setShowSuggestions(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--gold)]/10"
            >
              <svg
                className="h-4 w-4 text-[var(--foreground-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Recent searches section
 */
function RecentSearchesSection({
  searches,
  onSearchClick,
  onClear,
}: {
  searches: RecentSearch[];
  onSearchClick: (query: string) => void;
  onClear: () => void;
}) {
  if (searches.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--foreground-muted)]">
          Recent Searches
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-[var(--gold)] hover:underline"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <button
            key={index}
            onClick={() => onSearchClick(search.query)}
            className="group flex items-center gap-2 rounded-full border border-[var(--gold)]/20 bg-[var(--background-secondary)] px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:border-[var(--gold)]/40"
          >
            <svg
              className="h-3.5 w-3.5 text-[var(--foreground-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {search.query}
            <span className="text-xs text-[var(--foreground-muted)]">
              ({search.resultCount})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Loading skeleton for results
 */
function ResultsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-[var(--gold)]/10 bg-[var(--background-secondary)] p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="h-5 w-16 rounded-full bg-[var(--gold)]/10" />
            <div className="h-5 w-20 rounded bg-[var(--gold)]/10" />
          </div>
          <div className="mb-3 h-6 w-3/4 rounded bg-[var(--gold)]/10" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[var(--gold)]/5" />
            <div className="h-4 w-5/6 rounded bg-[var(--gold)]/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Empty state when no results found
 */
function EmptyState({ query }: { query: string }) {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gold)]/10">
        <svg
          className="h-8 w-8 text-[var(--gold)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
        No results found
      </h3>
      <p className="text-sm text-[var(--foreground-muted)]">
        No results found for &quot;{query}&quot;. Try different keywords or check
        your spelling.
      </p>
    </div>
  );
}

/**
 * Initial state before search
 */
function InitialState() {
  const popularSearches = [
    "mercy",
    "patience",
    "prayer",
    "forgiveness",
    "Allah",
    "intentions",
  ];

  return (
    <div className="py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--gold)]/10">
        <svg
          className="h-10 w-10 text-[var(--gold)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-[var(--foreground)]">
        Search the Quran & Hadith
      </h3>
      <p className="mb-6 text-sm text-[var(--foreground-muted)]">
        Find verses, hadiths, and topics across Islamic sources
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {popularSearches.map((term) => (
          <span
            key={term}
            className="rounded-full border border-[var(--gold)]/20 bg-[var(--gold)]/5 px-4 py-1.5 text-sm text-[var(--gold)]"
          >
            {term}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Main Search Page Component
 */
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SearchFilter>("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Update suggestions when query changes
  useEffect(() => {
    setSuggestions(getSearchSuggestions(query));
  }, [query]);

  // Perform search
  const performSearch = useCallback(
    async (searchQuery: string, searchFilter: SearchFilter) => {
      if (!searchQuery.trim()) return;

      setLoading(true);
      setHasSearched(true);

      try {
        const response = await search({
          query: searchQuery,
          filter: searchFilter,
          limit: 50,
        });

        setResults(response.results);
        setTotal(response.total);

        // Save to recent searches
        saveRecentSearch(searchQuery, response.total);
        setRecentSearches(getRecentSearches());

        // Update URL
        const params = new URLSearchParams();
        params.set("q", searchQuery);
        if (searchFilter !== "all") {
          params.set("filter", searchFilter);
        }
        router.push(`/search?${params.toString()}`, { scroll: false });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // Handle search button click
  const handleSearch = useCallback(() => {
    performSearch(query, filter);
  }, [query, filter, performSearch]);

  // Handle filter change
  const handleFilterChange = useCallback(
    (newFilter: SearchFilter) => {
      setFilter(newFilter);
      if (hasSearched && query.trim()) {
        performSearch(query, newFilter);
      }
    },
    [query, hasSearched, performSearch]
  );

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      performSearch(suggestion, filter);
    },
    [filter, performSearch]
  );

  // Handle recent search click
  const handleRecentSearchClick = useCallback(
    (recentQuery: string) => {
      setQuery(recentQuery);
      performSearch(recentQuery, filter);
    },
    [filter, performSearch]
  );

  // Handle clear recent searches
  const handleClearRecentSearches = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  // Initial search from URL params - only run once on mount
  const initialSearchDone = useRef(false);
  useEffect(() => {
    if (initialSearchDone.current) return;
    
    const urlQuery = searchParams.get("q");
    const urlFilter = searchParams.get("filter") as SearchFilter;
    
    if (urlQuery) {
      initialSearchDone.current = true;
      setQuery(urlQuery);
      if (urlFilter) setFilter(urlFilter);
      
      // Perform initial search
      (async () => {
        setLoading(true);
        setHasSearched(true);
        try {
          const response = await search({
            query: urlQuery,
            filter: urlFilter || "all",
            limit: 50,
          });
          setResults(response.results);
          setTotal(response.total);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
            <span className="text-[var(--gold)]">Search</span> Islamic Sources
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Find verses from the Quran and Hadith collections
          </p>
        </div>

          {/* Search Input */}
          <div className="mb-6">
            <SearchInput
              value={query}
              onChange={setQuery}
              onSearch={handleSearch}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>

          {/* Filter Tabs */}
          <div className="mb-8 flex justify-center gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  filter === tab.id
                    ? "bg-[var(--gold)] text-[var(--primary)]"
                    : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:bg-[var(--gold)]/10 hover:text-[var(--gold)]"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Recent Searches */}
          {!hasSearched && (
            <RecentSearchesSection
              searches={recentSearches}
              onSearchClick={handleRecentSearchClick}
              onClear={handleClearRecentSearches}
            />
          )}

          {/* Results Section */}
          <section>
            {loading ? (
              <ResultsSkeleton />
            ) : hasSearched ? (
              results.length > 0 ? (
                <>
                  {/* Results count */}
                  <div className="mb-4 text-sm text-[var(--foreground-muted)]">
                    Found <span className="font-medium text-[var(--gold)]">{total}</span>{" "}
                    result{total !== 1 ? "s" : ""} for &quot;{query}&quot;
                  </div>

                  {/* Results list */}
                  <div className="space-y-4">
                    {results.map((result) => (
                      <SearchResultCard
                        key={result.id}
                        result={result}
                        query={query}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState query={query} />
              )
            ) : (
              <InitialState />
            )}
          </section>
        </div>
      </main>
  );
}
