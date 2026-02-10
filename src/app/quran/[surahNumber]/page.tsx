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
import Header from "@/frontend/components/Header";
import Footer from "@/frontend/components/Footer";
import { SURAH_LIST } from "@/shared/types/quran";
import { getSurahWithTranslation } from "@/backend/services/quran-api";
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
 * Generate metadata for the page with enhanced SEO
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

  const title = `${surah.englishName} (${surah.name}) - Read & Listen | Noor ul Ilm`;
  const description = `Read and listen to Surah ${surah.englishName} (${surah.name}) - ${surah.englishNameTranslation}. ${surah.numberOfAyahs} verses revealed in ${surah.revelationType}. Features multiple reciters including Mishary Rashid Al-Afasy.`;

  return {
    title,
    description,
    keywords: [
      `Surah ${surah.englishName}`,
      surah.name,
      surah.englishNameTranslation,
      "Quran audio",
      "Quran recitation",
      `Surah ${surah.number}`,
      "Quran online",
      "read Quran",
      "listen Quran",
      "Mishary Rashid Al-Afasy",
    ],
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://noorulilm.com/quran/${surahNum}`,
      siteName: "Noor ul Ilm",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/quran/${surahNum}`,
    },
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

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${surah.englishName} (${surah.name})`,
    "description": `Read and listen to Surah ${surah.englishName} - ${surahMeta.englishNameTranslation}`,
    "url": `https://noorulilm.com/quran/${surahNum}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Noor ul Ilm",
      "url": "https://noorulilm.com",
    },
    "mainEntity": {
      "@type": "Chapter",
      "name": surah.englishName,
      "alternativeHeadline": surah.name,
      "position": surahNum,
      "numberOfPages": surah.numberOfAyahs,
      "isPartOf": {
        "@type": "Book",
        "name": "The Holy Quran",
        "inLanguage": "ar",
      },
      "audio": {
        "@type": "AudioObject",
        "name": `Surah ${surah.englishName} Recitation`,
        "description": `Audio recitation of Surah ${surah.englishName} by Mishary Rashid Al-Afasy`,
        "encodingFormat": "audio/mpeg",
        "contentUrl": `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNum}.mp3`,
      },
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Quran",
          "item": "https://noorulilm.com/quran",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": surah.englishName,
          "item": `https://noorulilm.com/quran/${surahNum}`,
        },
      ],
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
