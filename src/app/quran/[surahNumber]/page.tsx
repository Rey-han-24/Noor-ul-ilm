/**
 * Individual Surah Reading Page
 * 
 * Displays a complete Surah with:
 * - Authentic Arabic text (Uthmani script)
 * - Verse-by-verse translation
 * - Sidebar navigation to other Surahs
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SURAH_LIST } from "@/types/quran";
import { getSurahWithTranslation } from "@/lib/quran-api";
import SurahPageClient from "./SurahPageClient";

interface PageProps {
  params: Promise<{
    surahNumber: string;
  }>;
  searchParams: Promise<{
    translation?: string;
  }>;
}

/**
 * Generate static params for all 114 Surahs
 */
export async function generateStaticParams() {
  return SURAH_LIST.map((surah) => ({
    surahNumber: surah.number.toString(),
  }));
}

/**
 * Generate metadata for the page
 */
export async function generateMetadata({ params }: PageProps) {
  const { surahNumber } = await params;
  const surahNum = parseInt(surahNumber);
  const surah = SURAH_LIST.find((s) => s.number === surahNum);

  if (!surah) {
    return {
      title: "Surah Not Found | Noor ul Ilm",
    };
  }

  return {
    title: `${surah.englishName} (${surah.name}) | Noor ul Ilm`,
    description: `Read Surah ${surah.englishName} - ${surah.englishNameTranslation}. ${surah.numberOfAyahs} verses, ${surah.revelationType} revelation.`,
  };
}

export default async function SurahPage({ params, searchParams }: PageProps) {
  const { surahNumber } = await params;
  const { translation = "en.sahih" } = await searchParams;
  
  const surahNum = parseInt(surahNumber);

  // Validate surah number
  if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
    notFound();
  }

  // Get surah metadata
  const surahMeta = SURAH_LIST.find((s) => s.number === surahNum);
  if (!surahMeta) {
    notFound();
  }

  // Fetch surah data with translation
  let surahData;
  try {
    surahData = await getSurahWithTranslation(surahNum, translation);
  } catch (error) {
    console.error("Error fetching surah:", error);
    // Return error state
    return (
      <div className="flex min-h-screen flex-col bg-[var(--background)]">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-[var(--foreground)]">Failed to load Surah</p>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">Please try again later</p>
            <Link
              href="/quran/1"
              className="mt-4 inline-block rounded bg-[var(--gold)] px-4 py-2 text-sm font-medium text-[var(--primary)]"
            >
              Back to Quran
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { surah, translations } = surahData;

  // Previous and next surah for navigation
  const prevSurah = surahNum > 1 ? SURAH_LIST[surahNum - 2] : null;
  const nextSurah = surahNum < 114 ? SURAH_LIST[surahNum] : null;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />
      <SurahPageClient
        surah={surah}
        translations={translations}
        currentTranslation={translation}
        surahMeta={surahMeta}
        prevSurah={prevSurah}
        nextSurah={nextSurah}
      />
      <Footer />
    </div>
  );
}
