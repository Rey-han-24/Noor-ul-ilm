/**
 * Hadith Book Reading Page
 * 
 * Displays all hadiths within a specific book of a collection.
 * Includes reading controls and bookmark functionality.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Header from "@/frontend/components/Header";
import Footer from "@/frontend/components/Footer";
import HistoryRecorder from "@/frontend/components/HistoryRecorder";
import prisma from "@/backend/lib/prisma";
import { HadithBook, Hadith, HADITH_COLLECTIONS } from "@/shared/types/hadith";
import { getCollectionBooks, getBookHadiths } from "@/backend/services/hadith-api";
import HadithBookClient from "./HadithBookClient";

interface PageProps {
  params: Promise<{
    collectionId: string;
    bookNumber: string;
  }>;
}

/**
 * Fetch collection from database with fallback to static data
 */
async function getCollection(slug: string) {
  // Try database first
  try {
    const dbCollection = await prisma.hadithCollection.findUnique({
      where: { slug },
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

    if (dbCollection) return dbCollection;
  } catch (error) {
    console.error('Error fetching collection from DB:', error);
  }

  // Fallback to static data
  const staticCollection = HADITH_COLLECTIONS.find(c => c.id === slug);
  if (staticCollection) {
    return {
      id: staticCollection.id,
      slug: staticCollection.id,
      name: staticCollection.name,
      nameArabic: staticCollection.nameArabic,
      compiler: staticCollection.compilerName,
      description: staticCollection.description,
      totalHadiths: staticCollection.totalHadiths,
      totalBooks: staticCollection.totalBooks,
    };
  }

  return null;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { collectionId, bookNumber } = await params;
  const collection = await getCollection(collectionId);
  
  if (!collection) {
    return { title: "Book Not Found | Noor ul Ilm" };
  }

  return {
    title: `${collection.name} - Book ${bookNumber} | Noor ul Ilm`,
    description: `Read hadiths from Book ${bookNumber} of ${collection.name}`,
  };
}

export default async function BookPage({ params }: PageProps) {
  const { collectionId, bookNumber: bookNumberStr } = await params;
  const bookNumber = parseInt(bookNumberStr);

  // Fetch collection from database
  const collection = await getCollection(collectionId);
  if (!collection) {
    notFound();
  }

  // Validate book number
  if (isNaN(bookNumber) || bookNumber < 1) {
    notFound();
  }

  // Fetch books to get current book info
  let books: HadithBook[] = [];
  try {
    books = await getCollectionBooks(collectionId);
  } catch (error) {
    console.error("Error fetching books:", error);
  }

  const currentBook = books.find((b) => b.bookNumber === bookNumber);

  // Fetch hadiths with pagination
  let hadithData = { 
    hadiths: [] as Hadith[], 
    total: 0, 
    currentPage: 1,
    lastPage: 1,
    hasMore: false,
    limit: 25,
  };
  try {
    hadithData = await getBookHadiths(collectionId, bookNumber, { page: 1, limit: 25 });
  } catch (error) {
    console.error("Error fetching hadiths:", error);
  }

  // Get prev/next book
  const prevBook = books.find((b) => b.bookNumber === bookNumber - 1);
  const nextBook = books.find((b) => b.bookNumber === bookNumber + 1);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />
      <HistoryRecorder type="HADITH" collectionId={collectionId} bookNumber={bookNumber} />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-[var(--gold)]/20 bg-[var(--background)] py-8 sm:py-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--foreground-muted)]">
              <Link href="/hadith" className="hover:text-[var(--gold)]">
                Hadith
              </Link>
              <span>/</span>
              <Link href={`/hadith/${collectionId}`} className="hover:text-[var(--gold)]">
                {collection.name}
              </Link>
              <span>/</span>
              <span className="text-[var(--foreground)]">Book {bookNumber}</span>
            </nav>

            <div className="text-center">
              {/* Book Title */}
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 px-4 py-1">
                <span className="text-xs font-medium text-[var(--gold)]">
                  Book {bookNumber}
                </span>
                <span className="text-xs text-[var(--foreground-muted)]">•</span>
                <span className="text-xs text-[var(--foreground-muted)]">
                  {hadithData.total} Hadiths
                </span>
              </div>

              {currentBook && (
                <>
                  <h1 className="mb-2 text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
                    {currentBook.name}
                  </h1>
                  {currentBook.nameArabic && (
                    <p className="arabic-text text-xl text-[var(--gold)]">
                      {currentBook.nameArabic}
                    </p>
                  )}
                </>
              )}

              <p className="mt-3 text-sm text-[var(--foreground-muted)]">
                From {collection.name} ({collection.nameArabic})
              </p>
            </div>
          </div>
        </section>

        {/* Hadiths Section */}
        <HadithBookClient
          hadiths={hadithData.hadiths}
          collectionId={collectionId}
          collectionName={collection.name}
          bookNumber={bookNumber}
          bookName={currentBook?.name || `Book ${bookNumber}`}
          pagination={{
            currentPage: hadithData.currentPage,
            lastPage: hadithData.lastPage,
            total: hadithData.total,
            hasMore: hadithData.hasMore,
          }}
        />

        {/* Navigation */}
        <section className="border-t border-[var(--gold)]/20 bg-[var(--background)] py-6">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              {/* Previous Book */}
              {prevBook ? (
                <Link
                  href={`/hadith/${collectionId}/${prevBook.bookNumber}`}
                  className="group flex items-center gap-3 rounded-lg border border-[var(--gold)]/20 px-3 py-2 transition-all hover:border-[var(--gold)]/40 hover:bg-[var(--background-secondary)] sm:px-4 sm:py-3"
                >
                  <span className="text-[var(--gold)]">←</span>
                  <div>
                    <p className="hidden text-xs text-[var(--foreground-muted)] sm:block">
                      Previous Book
                    </p>
                    <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--gold)]">
                      {prevBook.name}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {/* Back to Collection */}
              <Link
                href={`/hadith/${collectionId}`}
                className="rounded-lg border border-[var(--gold)]/30 px-4 py-2 text-sm font-medium text-[var(--gold)] transition-colors hover:bg-[var(--gold)] hover:text-[var(--primary)]"
              >
                All Books
              </Link>

              {/* Next Book */}
              {nextBook ? (
                <Link
                  href={`/hadith/${collectionId}/${nextBook.bookNumber}`}
                  className="group flex items-center gap-3 rounded-lg border border-[var(--gold)]/20 px-3 py-2 transition-all hover:border-[var(--gold)]/40 hover:bg-[var(--background-secondary)] sm:px-4 sm:py-3"
                >
                  <div className="text-right">
                    <p className="hidden text-xs text-[var(--foreground-muted)] sm:block">
                      Next Book
                    </p>
                    <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--gold)]">
                      {nextBook.name}
                    </p>
                  </div>
                  <span className="text-[var(--gold)]">→</span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
