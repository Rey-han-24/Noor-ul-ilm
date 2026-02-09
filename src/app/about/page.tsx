/**
 * About Page
 * 
 * Information about Noor ul Ilm mission and team
 * Styled with royal black & gold theme
 * 
 * @module app/about
 */

import { Metadata } from 'next';
import Header from '@/frontend/components/Header';
import Footer from '@/frontend/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | Noor ul Ilm',
  description: 'Learn about Noor ul Ilm - our mission to provide authentic Quran and Hadith resources to Muslims worldwide. Discover our story, values, and vision.',
  openGraph: {
    title: 'About Us | Noor ul Ilm',
    description: 'Learn about Noor ul Ilm - our mission to provide authentic Islamic resources.',
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-[var(--gold)]/5 to-transparent">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-block px-4 py-1 bg-[var(--gold)]/10 rounded-full border border-[var(--gold)]/20 mb-6">
                <span className="text-[var(--gold)] text-sm font-medium">About Us</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
                <span className="text-[var(--gold)]">نور العلم</span>
                <br />
                Light of Knowledge
              </h1>
              <p className="text-lg text-[var(--foreground-muted)]">
                Illuminating hearts and minds with the timeless wisdom of the Quran and authentic Hadith.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-8">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center text-3xl mb-6">
                    🎯
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Our Mission</h2>
                  <p className="text-[var(--foreground-muted)] leading-relaxed">
                    To make authentic Islamic knowledge accessible to every Muslim worldwide through technology. We strive to provide accurate, properly sourced Quranic text and Hadith with verified translations and gradings.
                  </p>
                </div>
                
                <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-8">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-3xl mb-6">
                    👁️
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Our Vision</h2>
                  <p className="text-[var(--foreground-muted)] leading-relaxed">
                    To become the most trusted digital platform for Quran and Hadith study, enabling Muslims of all backgrounds to connect with their faith through authentic, well-organized, and beautifully presented resources.
                  </p>
                </div>
              </div>

              {/* Values */}
              <div className="bg-gradient-to-br from-[var(--card-bg)] to-[var(--gold)]/5 rounded-2xl border border-[var(--gold)]/20 p-8 mb-16">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8 text-center flex items-center justify-center gap-2">
                  <span className="text-[var(--gold)]">✦</span> Our Core Values
                </h2>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-2xl mx-auto mb-4">
                      📚
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-2">Authenticity</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Every piece of content is verified from authentic sources
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-2xl mx-auto mb-4">
                      🌍
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-2">Accessibility</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Free and accessible to Muslims worldwide
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-2xl mx-auto mb-4">
                      ✨
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-2">Excellence</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Highest standards in design and user experience
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-2xl mx-auto mb-4">
                      🤝
                    </div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-2">Community</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Built by Muslims, for Muslims, with love
                    </p>
                  </div>
                </div>
              </div>

              {/* What We Offer */}
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8 text-center flex items-center justify-center gap-2">
                  <span className="text-[var(--gold)]">✦</span> What We Offer
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-6 hover:border-[var(--gold)]/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                        📖
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)] mb-2">The Holy Quran</h3>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          All 114 Surahs with authentic Uthmani script, multiple verified translations, and beautiful Arabic typography.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-6 hover:border-[var(--gold)]/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                        📜
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)] mb-2">Hadith Collections</h3>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          Major Hadith collections including Bukhari, Muslim, and more with proper grading and chain of narration.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-6 hover:border-[var(--gold)]/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                        🔍
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)] mb-2">Powerful Search</h3>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          Search across all content in Arabic and English to find exactly what you need quickly.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-6 hover:border-[var(--gold)]/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                        🔖
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)] mb-2">Personal Library</h3>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          Save bookmarks, track reading history, and pick up where you left off on any device.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-10">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
                  Join Our Journey
                </h2>
                <p className="text-[var(--foreground-muted)] mb-8 max-w-xl mx-auto">
                  Support our mission to spread authentic Islamic knowledge worldwide. Every contribution makes a difference.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/donate"
                    className="px-8 py-3 bg-gradient-to-r from-[var(--gold)] to-amber-500 text-black font-bold rounded-lg hover:from-amber-500 hover:to-[var(--gold)] transition-all"
                  >
                    Support Us
                  </Link>
                  <Link
                    href="/contact"
                    className="px-8 py-3 border border-[var(--gold)] text-[var(--gold)] font-medium rounded-lg hover:bg-[var(--gold)]/10 transition-colors"
                  >
                    Get In Touch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
