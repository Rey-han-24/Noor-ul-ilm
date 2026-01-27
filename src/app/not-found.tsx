/**
 * Custom 404 Not Found Page
 * 
 * Displays when a page is not found.
 * Maintains consistent branding and helps users navigate.
 */

import Link from "next/link";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />
      
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          {/* Arabic 404 */}
          <p className="arabic-text mb-4 text-6xl text-[var(--gold)]">٤٠٤</p>
          
          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold text-[var(--foreground)]">
            Page Not Found
          </h1>
          
          {/* Description */}
          <p className="mb-8 max-w-md text-[var(--foreground-muted)]">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          
          {/* Quick links */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="rounded-lg bg-[var(--gold)] px-6 py-3 font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--gold-hover)]"
            >
              Go Home
            </Link>
            <Link
              href="/quran"
              className="rounded-lg border border-[var(--gold)] px-6 py-3 font-semibold text-[var(--gold)] transition-colors hover:bg-[var(--gold)] hover:text-[var(--primary)]"
            >
              Read Quran
            </Link>
            <Link
              href="/hadith"
              className="rounded-lg border border-[var(--gold)] px-6 py-3 font-semibold text-[var(--gold)] transition-colors hover:bg-[var(--gold)] hover:text-[var(--primary)]"
            >
              Browse Hadith
            </Link>
          </div>
          
          {/* Search suggestion */}
          <p className="mt-8 text-sm text-[var(--foreground-muted)]">
            Try searching for what you need:{" "}
            <Link href="/search" className="text-[var(--gold)] hover:underline">
              Search →
            </Link>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
