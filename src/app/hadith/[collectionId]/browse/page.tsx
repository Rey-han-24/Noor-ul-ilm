/**
 * Browse All Hadiths Page
 * 
 * Allows users to browse ALL hadiths in a collection with pagination.
 * This provides access to thousands of hadiths without requiring
 * navigation through individual chapters.
 */

import { notFound } from "next/navigation";
import { Metadata } from "next";
import Header from "@/frontend/components/Header";
import Footer from "@/frontend/components/Footer";
import { HADITH_COLLECTIONS } from "@/shared/types/hadith";
import { isHadithAPICollection } from "@/backend/services/hadith-api";
import BrowseAllClient from "./BrowseAllClient";

interface PageProps {
  params: Promise<{ collectionId: string }>;
  searchParams: Promise<{ page?: string }>;
}

/**
 * Get collection info from static data
 */
function getCollection(collectionId: string) {
  return HADITH_COLLECTIONS.find(c => c.id === collectionId) || null;
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { collectionId } = await params;
  const collection = getCollection(collectionId);

  if (!collection) {
    return { title: "Collection Not Found | Noor ul Ilm" };
  }

  return {
    title: `Browse All ${collection.name} Hadiths | Noor ul Ilm`,
    description: `Browse all ${collection.totalHadiths.toLocaleString()} hadiths from ${collection.name}`,
  };
}

export default async function BrowseAllPage({ params, searchParams }: PageProps) {
  const { collectionId } = await params;
  const { page: pageStr } = await searchParams;

  // Validate collection
  if (!isHadithAPICollection(collectionId)) {
    notFound();
  }

  const collection = getCollection(collectionId);
  if (!collection) {
    notFound();
  }

  const initialPage = parseInt(pageStr || "1", 10) || 1;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="border-b border-[var(--gold)]/20 bg-[var(--background)] py-8 sm:py-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 px-4 py-1">
                <span className="text-xs font-medium text-[var(--gold)]">
                  Browse All
                </span>
              </div>

              <h1 className="mb-2 text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
                {collection.name}
              </h1>
              <p className="arabic-text text-xl text-[var(--gold)]">
                {collection.nameArabic}
              </p>

              <p className="mt-3 text-sm text-[var(--foreground-muted)]">
                {collection.totalHadiths.toLocaleString()} Hadiths • Compiled by {collection.compilerName}
              </p>
            </div>
          </div>
        </section>

        {/* Hadiths Browser */}
        <BrowseAllClient
          collectionId={collectionId}
          collectionName={collection.name}
          initialPage={initialPage}
        />
      </main>

      <Footer />
    </div>
  );
}
