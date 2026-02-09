/**
 * Footer Component
 *
 * Features:
 * - Royal black and gold theme
 * - Quick links
 * - Copyright and attribution
 */

import Link from "next/link";

/**
 * Quick navigation links for footer
 */
const footerLinks = [
  { href: "/quran", label: "Quran" },
  { href: "/hadith", label: "Hadith" },
  { href: "/search", label: "Search" },
  { href: "/donate", label: "Donate" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--gold)]/20 bg-[var(--primary)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="flex flex-col items-center text-center">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--gold)]">
              <span className="text-2xl text-[var(--gold)]">☪</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="brand-text text-xl font-bold tracking-wide text-[var(--gold)]">
                NOOR UL ILM
              </span>
              <span className="arabic-text text-sm text-[var(--gold)]/70" style={{ textAlign: "left" }}>
                نور العلم
              </span>
            </div>
          </div>

          {/* Tagline */}
          <p className="mt-4 text-sm text-white/60">
            Light of Knowledge - Your trusted source for authentic Islamic teachings
          </p>

          {/* Quick Links */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 transition-colors hover:text-[var(--gold)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="mt-8 h-px w-full max-w-md bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

          {/* Bismillah */}
          <p className="arabic-text mt-8 text-xl text-[var(--gold)]/80">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>

          {/* Copyright */}
          <div className="mt-8 space-y-2">
            <p className="text-xs text-white/40">
              © {currentYear} Noor ul Ilm. All rights reserved.
            </p>
            <p className="text-xs text-white/30">
              All Quran text and Hadith are from authentic, verified sources.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
