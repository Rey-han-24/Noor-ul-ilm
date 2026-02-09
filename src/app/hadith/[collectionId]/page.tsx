/**
 * Hadith Collection Page
 * 
 * Displays all books within a specific Hadith collection.
 * Allows navigation to individual books to read hadiths.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Header from "@/frontend/components/Header";
import Footer from "@/frontend/components/Footer";
import HistoryRecorder from "@/frontend/components/HistoryRecorder";
import prisma from "@/backend/lib/prisma";
import { getCollectionBooks } from "@/backend/services/hadith-api";
import { HadithBook } from "@/shared/types/hadith";

interface PageProps {
  params: Promise<{
    collectionId: string;
  }>;
}

/**
 * Fetch collection from database
 */
async function getCollection(slug: string) {
  try {
    return await prisma.hadithCollection.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        nameArabic: true,
        compiler: true,
        compilerArabic: true,
        description: true,
        totalHadiths: true,
        totalBooks: true,
      },
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return null;
  }
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { collectionId } = await params;
  const collection = await getCollection(collectionId);

  if (!collection) {
    return {
      title: "Collection Not Found | Noor ul Ilm",
    };
  }

  return {
    title: `${collection.name} | Noor ul Ilm`,
    description: collection.description || `Browse ${collection.name} - compiled by ${collection.compiler}`,
  };
}

/**
 * Book card component
 */
function BookCard({
  book,
  collectionId,
}: {
  book: HadithBook;
  collectionId: string;
}) {
  return (
    <Link
      href={`/hadith/${collectionId}/${book.bookNumber}`}
      className="group flex items-center gap-4 rounded-lg border border-[var(--gold)]/20 bg-[var(--background)] p-4 transition-all duration-300 hover:border-[var(--gold)]/50 hover:bg-[var(--background-secondary)]"
    >
      {/* Book Number */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--gold)]/30 bg-[var(--gold)]/10 text-lg font-semibold text-[var(--gold)] transition-colors group-hover:bg-[var(--gold)] group-hover:text-[var(--primary)]">
        {book.bookNumber}
      </div>

      {/* Book Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-[var(--foreground)] transition-colors group-hover:text-[var(--gold)]">
              {book.name}
            </h3>
            {book.nameArabic && (
              <p className="arabic-text mt-0.5 text-sm text-[var(--foreground-muted)]">
                {book.nameArabic}
              </p>
            )}
          </div>
          <span className="flex-shrink-0 rounded-full bg-[var(--gold)]/10 px-2 py-0.5 text-xs font-medium text-[var(--gold)]">
            {book.hadithCount} hadiths
          </span>
        </div>
      </div>

      {/* Arrow */}
      <svg
        className="h-5 w-5 flex-shrink-0 text-[var(--gold)] opacity-0 transition-opacity group-hover:opacity-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default async function CollectionPage({ params }: PageProps) {
  const { collectionId } = await params;

  // Fetch collection from database
  const collection = await getCollection(collectionId);
  if (!collection) {
    notFound();
  }

  // Fetch books
  let books: HadithBook[] = [];
  try {
    books = await getCollectionBooks(collectionId);
  } catch (error) {
    console.error("Error fetching books:", error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />
      <HistoryRecorder type="HADITH" collectionId={collectionId} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-[var(--gold)]/20 bg-[var(--background)] py-10 sm:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
              <Link href="/hadith" className="hover:text-[var(--gold)]">
                Hadith
              </Link>
              <span>/</span>
              <span className="text-[var(--foreground)]">{collection.name}</span>
            </nav>

            <div className="text-center">
              {/* Arabic Name */}
              <h1 className="arabic-text mb-3 text-4xl text-[var(--gold)] sm:text-5xl">
                {collection.nameArabic}
              </h1>

              {/* English Name */}
              <h2 className="mb-3 text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
                {collection.name}
              </h2>

              {/* Compiler */}
              <p className="mb-4 text-[var(--foreground-muted)]">
                Compiled by {collection.compiler}
                {collection.compilerArabic && (
                  <span className="arabic-text ml-2 text-sm">({collection.compilerArabic})</span>
                )}
              </p>

              {/* Description */}
              {collection.description && (
                <p className="mx-auto max-w-2xl text-sm text-[var(--foreground-secondary)]">
                  {collection.description}
                </p>
              )}

              {/* Stats */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-[var(--foreground)]">{collection.totalBooks} Books</span>
                </div>
                <div className="h-4 w-px bg-[var(--gold)]/30" />
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-[var(--foreground)]">{collection.totalHadiths.toLocaleString()} Hadiths</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Books List */}
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h3 className="mb-6 text-lg font-semibold text-[var(--foreground)]">
              Books in this Collection
            </h3>

            {books.length > 0 ? (
              <div className="space-y-3">
                {books.map((book) => (
                  <BookCard key={book.bookNumber} book={book} collectionId={collectionId} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-[var(--gold)]/20 bg-[var(--background-secondary)] p-8 text-center">
                <p className="text-[var(--foreground-muted)]">
                  Unable to load books. Please try again later.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
