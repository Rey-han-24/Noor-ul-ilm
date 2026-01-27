/**
 * Noor ul Ilm - Home Page
 *
 * Royal black and gold themed landing page with:
 * - Fade-in animations on first visit
 * - Three-column hero: Verse of Day | Main Title | Hadith of Day
 * - Feature cards
 * - Fully responsive design
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getDailyVerse, getDailyHadith } from "@/lib/daily-content";

/**
 * Feature card data for the main sections of the app
 */
const features = [
  {
    title: "Al-Quran",
    titleArabic: "القرآن الكريم",
    description:
      "Read the Holy Quran with translations in multiple languages.",
    href: "/quran",
    icon: "📖",
  },
  {
    title: "Hadith",
    titleArabic: "الأحاديث",
    description:
      "Explore authentic Hadith from major collections.",
    href: "/hadith",
    icon: "📚",
  },
  {
    title: "Search",
    titleArabic: "البحث",
    description:
      "Find verses and Hadiths from authentic sources.",
    href: "/search",
    icon: "🔍",
  },
  {
    title: "Donate",
    titleArabic: "تبرع",
    description:
      "Support Islamic causes and give Sadaqah.",
    href: "/donate",
    icon: "💝",
  },
];

export default function Home() {
  // Get daily content (changes automatically each day)
  const dailyVerse = getDailyVerse();
  const dailyHadith = getDailyHadith();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--primary)]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section - Three Column Layout */}
        <section className="relative min-h-[calc(100vh-73px)] overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--gold)_1px,_transparent_1px)] bg-[size:50px_50px]" />
          </div>

          {/* Three Column Grid */}
          <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:gap-12 lg:px-8 lg:py-0">
            
            {/* Left Column - Verse of the Day */}
            <div 
              className="flex animate-fade-in-up items-center justify-center lg:items-center lg:justify-start"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="daily-card w-full max-w-sm cursor-default rounded-lg p-6 text-center backdrop-blur-sm lg:text-left">
                {/* Label */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 px-3 py-1">
                  <span className="text-[10px] text-[var(--gold)]">✦</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--gold)]">
                    Verse of the Day
                  </span>
                </div>

                {/* Arabic Text */}
                <p className="arabic-text text-xl leading-relaxed text-[var(--foreground)] lg:text-lg xl:text-xl">
                  {dailyVerse.arabic}
                </p>

                {/* Translation */}
                <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--foreground-secondary)]">
                  &ldquo;{dailyVerse.translation}&rdquo;
                </p>

                {/* Reference */}
                <p className="mt-3 text-xs font-medium text-[var(--gold)]">
                  {dailyVerse.reference}
                </p>
              </div>
            </div>

            {/* Center Column - Main Title */}
            <div className="flex flex-col items-center justify-center text-center">
              {/* Arabic Title */}
              <h1 
                className="arabic-text animate-fade-in-up text-5xl font-bold text-[var(--gold)] sm:text-6xl lg:text-7xl"
                style={{ animationDelay: "0.1s" }}
              >
                نور العلم
              </h1>

              {/* English Title */}
              <h2 
                className="brand-text mt-4 animate-fade-in-up text-xl font-semibold tracking-[0.3em] text-[var(--gold)] sm:text-2xl lg:text-2xl"
                style={{ animationDelay: "0.3s" }}
              >
                NOOR UL ILM
              </h2>

              {/* Decorative Divider */}
              <div 
                className="mx-auto my-6 flex animate-fade-in-up items-center justify-center gap-4"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--gold)]/50 sm:w-12" />
                <span className="text-lg text-[var(--gold)]">☪</span>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--gold)]/50 sm:w-12" />
              </div>

              {/* Bismillah */}
              <p 
                className="arabic-text animate-fade-in-up text-lg text-white/80 sm:text-xl"
                style={{ animationDelay: "0.6s" }}
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
              <p 
                className="mt-2 animate-fade-in-up text-xs text-white/40"
                style={{ animationDelay: "0.7s" }}
              >
                In the name of Allah, the Most Gracious, the Most Merciful
              </p>

              {/* CTA Buttons */}
              <div 
                className="mt-8 flex animate-fade-in-up flex-col items-center justify-center gap-3 sm:flex-row"
                style={{ animationDelay: "0.9s" }}
              >
                <Link
                  href="/quran"
                  className="group inline-flex items-center gap-2 rounded bg-[var(--gold)] px-6 py-2.5 text-sm font-semibold text-[var(--primary)] transition-all hover:bg-[var(--gold-light)] hover:shadow-lg hover:shadow-[var(--gold)]/20"
                >
                  <span>Read Quran</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/hadith"
                  className="inline-flex items-center gap-2 rounded border border-[var(--gold)] px-6 py-2.5 text-sm font-semibold text-[var(--gold)] transition-all hover:bg-[var(--gold)] hover:text-[var(--primary)]"
                >
                  Explore Hadith
                </Link>
              </div>
            </div>

            {/* Right Column - Hadith of the Day */}
            <div 
              className="flex animate-fade-in-up items-center justify-center lg:items-center lg:justify-end"
              style={{ animationDelay: "1s" }}
            >
              <div className="daily-card w-full max-w-sm cursor-default rounded-lg p-6 text-center backdrop-blur-sm lg:text-right">
                {/* Label */}
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 px-3 py-1">
                  <span className="text-[10px] text-[var(--gold)]">✦</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--gold)]">
                    Hadith of the Day
                  </span>
                </div>

                {/* Arabic Text */}
                <p className="arabic-text text-xl leading-relaxed text-[var(--foreground)] lg:text-lg xl:text-xl">
                  {dailyHadith.arabic}
                </p>

                {/* Translation */}
                <p className="mt-4 text-sm font-medium leading-relaxed text-[var(--foreground-secondary)]">
                  &ldquo;{dailyHadith.translation}&rdquo;
                </p>

                {/* Source with Hadith Number */}
                <p className="mt-3 text-xs font-medium text-[var(--gold)]">
                  {dailyHadith.source} #{dailyHadith.hadithNumber}
                </p>
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                  {dailyHadith.narrator}
                </p>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
            <span className="text-sm text-white/30">↓</span>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="relative overflow-hidden border-y border-[var(--gold)]/20 py-16 sm:py-20" style={{ background: "var(--gold-strip-bg)" }}>
          {/* Decorative gold accent line at top */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Title */}
            <div className="mb-12 text-center">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                ✦ Explore ✦
              </h3>
              <p className="mt-2 text-xl font-bold text-[var(--foreground)] sm:text-2xl">
                Discover Islamic Knowledge
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group relative overflow-hidden rounded-lg border border-[var(--gold)]/20 bg-[var(--background)] p-5 text-center transition-all duration-300 hover:border-[var(--gold)]/60 hover:shadow-xl hover:shadow-[var(--gold)]/15 hover:-translate-y-1"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  {/* Icon */}
                  <span className="text-3xl">{feature.icon}</span>

                  {/* Arabic Title */}
                  <p className="arabic-text mt-3 text-base text-[var(--gold)]">
                    {feature.titleArabic}
                  </p>

                  {/* English Title */}
                  <h4 className="mt-1 text-lg font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--gold)]">
                    {feature.title}
                  </h4>

                  {/* Description */}
                  <p className="mt-2 text-xs text-[var(--foreground-muted)]">
                    {feature.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Decorative Divider */}
        <section className="bg-[var(--background)] py-8">
          <div className="mx-auto flex max-w-xs items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--gold)]/40" />
            <span className="text-[var(--gold)]/60">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--gold)]/40" />
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative border-y border-[var(--gold)]/20 py-14 sm:py-16" style={{ background: "var(--gold-strip-bg)" }}>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              <div>
                <p className="text-3xl font-bold text-[var(--gold)] sm:text-4xl">114</p>
                <p className="mt-2 text-sm font-medium text-[var(--foreground-secondary)]">Surahs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--gold)] sm:text-4xl">6,236</p>
                <p className="mt-2 text-sm font-medium text-[var(--foreground-secondary)]">Verses</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--gold)] sm:text-4xl">6</p>
                <p className="mt-2 text-sm font-medium text-[var(--foreground-secondary)]">Hadith Books</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--gold)] sm:text-4xl">10+</p>
                <p className="mt-2 text-sm font-medium text-[var(--foreground-secondary)]">Languages</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Spacing */}
        <section className="bg-[var(--background)] py-8" />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}