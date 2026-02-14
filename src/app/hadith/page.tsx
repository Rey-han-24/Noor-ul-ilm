/**
 * Hadith Collections Page
 * 
 * Main entry point for the Hadith section.
 * Fetches collections from database with fallback to static data.
 */

import Link from "next/link";
import { Metadata } from "next";
import Header from "@/frontend/components/Header";
import Footer from "@/frontend/components/Footer";
import prisma from "@/backend/lib/prisma";
import { HADITH_COLLECTIONS } from "@/shared/types/hadith";

export const metadata: Metadata = {
  title: "Hadith Collections | Noor ul Ilm",
  description: "Browse the six major authentic Hadith collections: Sahih Bukhari, Sahih Muslim, Tirmidhi, Abu Dawud, Nasai, and Ibn Majah.",
};

/** Collection type for display */
interface CollectionDisplay {
  id: string;
  slug: string;
  name: string;
  nameArabic: string;
  compiler: string;
  description: string | null;
  totalHadiths: number;
  totalBooks: number;
  /** Sort priority — lower = shown first */
  sortOrder: number;
}

/** Predefined sort order: Sahih collections first, then Sunan, then others */
const COLLECTION_SORT_ORDER: Record<string, number> = {
  bukhari: 1,
  muslim: 2,
  tirmidhi: 3,
  abudawud: 4,
  nasai: 5,
  ibnmajah: 6,
  malik: 7,
  nawawi: 8,
};

/**
 * Fetch collections from database, merged with static data
 * Static HADITH_COLLECTIONS provides reliable book counts and ordering
 */
async function getCollections(): Promise<CollectionDisplay[]> {
  // Build static collection map for reliable metadata
  const staticMap = new Map(
    HADITH_COLLECTIONS.map(c => [c.id, c])
  );

  try {
    const dbCollections = await prisma.hadithCollection.findMany({
      where: { isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        nameArabic: true,
        compiler: true,
        description: true,
        totalHadiths: true,
        totalBooks: true,
      },
    });

    if (dbCollections.length > 0) {
      // Merge DB data with static data for accurate book counts
      const collections: CollectionDisplay[] = dbCollections.map(db => {
        const staticData = staticMap.get(db.slug);
        return {
          id: db.id,
          slug: db.slug,
          name: db.name,
          nameArabic: db.nameArabic,
          compiler: db.compiler,
          description: db.description,
          // Use static book count if DB shows 0
          totalHadiths: db.totalHadiths > 0 ? db.totalHadiths : (staticData?.totalHadiths ?? 0),
          totalBooks: db.totalBooks > 0 ? db.totalBooks : (staticData?.totalBooks ?? 0),
          sortOrder: COLLECTION_SORT_ORDER[db.slug] ?? 99,
        };
      });

      // Sort: Sahih first, then by defined order
      collections.sort((a, b) => a.sortOrder - b.sortOrder);
      return collections;
    }

    // Fallback to static data if database is empty
    return HADITH_COLLECTIONS.map(c => ({
      id: c.id,
      slug: c.id,
      name: c.name,
      nameArabic: c.nameArabic,
      compiler: c.compilerName,
      description: c.description,
      totalHadiths: c.totalHadiths,
      totalBooks: c.totalBooks,
      sortOrder: COLLECTION_SORT_ORDER[c.id] ?? 99,
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    // Fallback to static data on error
    return HADITH_COLLECTIONS.map(c => ({
      id: c.id,
      slug: c.id,
      name: c.name,
      nameArabic: c.nameArabic,
      compiler: c.compilerName,
      description: c.description,
      totalHadiths: c.totalHadiths,
      totalBooks: c.totalBooks,
      sortOrder: COLLECTION_SORT_ORDER[c.id] ?? 99,
    }));
  }
}

/**
 * Collection card component
 */
function CollectionCard({ collection }: { collection: CollectionDisplay }) {
  return (
    <Link
      href={`/hadith/${collection.slug}`}
      className="group relative overflow-hidden rounded-xl border border-[var(--gold)]/20 bg-[var(--background)] p-6 transition-all duration-300 hover:border-[var(--gold)]/50 hover:shadow-lg hover:shadow-[var(--gold)]/5"
    >
      {/* Decorative corner */}
      <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-[var(--gold)]/5 transition-transform duration-300 group-hover:scale-150" />
      
      {/* Arabic Name */}
      <div className="mb-4">
        <span className="arabic-text text-2xl text-[var(--gold)]">
          {collection.nameArabic}
        </span>
      </div>

      {/* English Name */}
      <h2 className="mb-2 text-xl font-semibold text-[var(--foreground)] transition-colors group-hover:text-[var(--gold)]">
        {collection.name}
      </h2>

      {/* Compiler */}
      <p className="mb-3 text-sm text-[var(--foreground-muted)]">
        By {collection.compiler}
      </p>

      {/* Description */}
      {collection.description && (
        <p className="mb-4 line-clamp-2 text-sm text-[var(--foreground-secondary)]">
          {collection.description}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {collection.totalBooks} Books
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {collection.totalHadiths.toLocaleString()} Hadiths
        </span>
      </div>

      {/* Arrow indicator */}
      <div className="absolute bottom-6 right-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <svg className="h-5 w-5 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Link>
  );
}

export default async function HadithPage() {
  const collections = await getCollections();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-[var(--gold)]/20 bg-[var(--background)] py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Arabic Title */}
              <h1 className="arabic-text mb-4 text-4xl text-[var(--gold)] sm:text-5xl">
                الأحاديث النبوية
              </h1>
              
              {/* English Title */}
              <h2 className="mb-4 text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
                Hadith Collections
              </h2>
              
              {/* Subtitle */}
              <p className="mx-auto max-w-2xl text-[var(--foreground-muted)]">
                Explore the six major authentic collections of Prophetic traditions (Hadith).
                Each collection contains carefully verified narrations from the Prophet Muhammad ﷺ.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="border-b border-[var(--gold)]/20 bg-[var(--gold)]/5 py-4">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--gold)]">{collections.length}</span>
                <span className="text-[var(--foreground-muted)]">Major Collections</span>
              </div>
              <div className="hidden h-4 w-px bg-[var(--gold)]/30 sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--gold)]">
                  {collections.reduce((sum, c) => sum + c.totalHadiths, 0).toLocaleString()}+
                </span>
                <span className="text-[var(--foreground-muted)]">Authentic Hadiths</span>
              </div>
              <div className="hidden h-4 w-px bg-[var(--gold)]/30 sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[var(--gold)]">
                  {collections.reduce((sum, c) => sum + c.totalBooks, 0).toLocaleString()}+
                </span>
                <span className="text-[var(--foreground-muted)]">Books & Chapters</span>
              </div>
            </div>
          </div>
        </section>

        {/* Collections Grid */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                The Six Major Books (الكتب الستة)
              </h3>
            </div>

            {/* Collections Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="border-t border-[var(--gold)]/20 bg-[var(--background-secondary)] py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-[var(--gold)]/20 bg-[var(--background)] p-6 sm:p-8">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                <svg className="h-5 w-5 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Hadith Sciences
              </h3>
              <div className="space-y-4 text-sm text-[var(--foreground-secondary)]">
                <p>
                  <strong className="text-[var(--foreground)]">Hadith</strong> (حديث) refers to the recorded sayings, 
                  actions, and approvals of the Prophet Muhammad ﷺ. They are the second source of Islamic law 
                  after the Quran.
                </p>
                <p>
                  Each hadith is graded based on the reliability of its chain of narration (Isnad):
                </p>
                <ul className="ml-4 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                    <strong className="text-emerald-500">Sahih</strong> - Authentic, highest level of reliability
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                    <strong className="text-blue-500">Hasan</strong> - Good, acceptable level of authenticity
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-500"></span>
                    <strong className="text-amber-500">Da&apos;if</strong> - Weak, has some deficiency in the chain
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
