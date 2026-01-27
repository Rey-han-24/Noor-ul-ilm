/**
 * Donate Page
 * 
 * Allows users to support the platform through donations.
 * Features multiple donation tiers and secure payment options.
 * 
 * SEO optimized for discoverability
 */

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support Noor ul Ilm - Donate",
  description: "Support the development of free Islamic resources. Your donations help us provide Quran, Hadith, and Islamic education to millions worldwide.",
  keywords: ["donate", "sadaqah", "Islamic charity", "support Islam", "Quran donation"],
  openGraph: {
    title: "Support Noor ul Ilm - Donate",
    description: "Help us spread Islamic knowledge worldwide. Your support makes a difference.",
    type: "website",
  },
};

/**
 * Donation tier configuration
 */
const DONATION_TIERS = [
  {
    id: "supporter",
    name: "Supporter",
    amount: 10,
    description: "Help cover server costs for one day",
    features: ["Support daily operations", "Help maintain uptime"],
    icon: "💚",
  },
  {
    id: "contributor",
    name: "Contributor",
    amount: 25,
    description: "Fund content verification for a week",
    features: ["Support content review", "Help verify translations", "Enable new features"],
    icon: "⭐",
    popular: true,
  },
  {
    id: "patron",
    name: "Patron",
    amount: 50,
    description: "Support a month of development",
    features: ["Fund new features", "Support team growth", "Priority feature requests"],
    icon: "🌟",
  },
  {
    id: "benefactor",
    name: "Benefactor",
    amount: 100,
    description: "Major platform development",
    features: ["Fund major features", "Support expansion", "Recognition on donors page", "Direct impact report"],
    icon: "👑",
  },
];

/**
 * Impact statistics
 */
const IMPACT_STATS = [
  { label: "Daily Readers", value: "10,000+", icon: "📖" },
  { label: "Verses Accessed", value: "1M+", icon: "📜" },
  { label: "Countries Reached", value: "50+", icon: "🌍" },
  { label: "Hadiths Available", value: "30,000+", icon: "📚" },
];

/**
 * Donation tier card component
 */
function DonationTierCard({ tier }: { tier: typeof DONATION_TIERS[0] }) {
  return (
    <div
      className={`relative rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${
        tier.popular
          ? "border-[var(--gold)] bg-[var(--gold)]/5 shadow-md shadow-[var(--gold)]/10"
          : "border-[var(--gold)]/20 bg-[var(--background)] hover:border-[var(--gold)]/40"
      }`}
    >
      {/* Popular badge */}
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-[var(--gold)] px-4 py-1 text-xs font-semibold text-[var(--primary)]">
            Most Popular
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="mb-4 text-4xl">{tier.icon}</div>

      {/* Name */}
      <h3 className="mb-2 text-xl font-bold text-[var(--foreground)]">{tier.name}</h3>

      {/* Amount */}
      <div className="mb-4">
        <span className="text-3xl font-bold text-[var(--gold)]">${tier.amount}</span>
        <span className="text-sm text-[var(--foreground-muted)]"> / one-time</span>
      </div>

      {/* Description */}
      <p className="mb-6 text-sm text-[var(--foreground-muted)]">{tier.description}</p>

      {/* Features */}
      <ul className="mb-6 space-y-2">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
            <svg className="h-4 w-4 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* Donate button */}
      <button
        className={`w-full rounded-lg py-3 font-semibold transition-all duration-200 ${
          tier.popular
            ? "bg-[var(--gold)] text-[var(--primary)] hover:bg-[var(--gold-hover)]"
            : "border border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--primary)]"
        }`}
      >
        Donate ${tier.amount}
      </button>
    </div>
  );
}

export default function DonatePage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[var(--gold)]/20 bg-gradient-to-b from-[var(--gold)]/5 to-transparent py-16 sm:py-24">
        {/* Decorative elements */}
        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-[var(--gold)]/5 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-48 w-48 rounded-full bg-[var(--gold)]/5 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          {/* Arabic title */}
          <p className="arabic-text mb-4 text-2xl text-[var(--gold)]">
            صدقة جارية
          </p>

          {/* Main title */}
          <h1 className="mb-6 text-4xl font-bold text-[var(--foreground)] sm:text-5xl">
            Support <span className="text-[var(--gold)]">Islamic Knowledge</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-lg text-[var(--foreground-muted)]">
            Your generous contribution helps us provide free access to the Quran, Hadith, 
            and authentic Islamic teachings to Muslims around the world.
          </p>

          {/* Hadith quote */}
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-[var(--gold)]/20 bg-[var(--background)] p-6">
            <p className="arabic-text mb-3 text-lg text-[var(--gold)]">
              &ldquo;مَن دَلَّ على خَيرٍ فلَه مِثلُ أجرِ فاعِلِه&rdquo;
            </p>
            <p className="text-sm italic text-[var(--foreground-secondary)]">
              &ldquo;Whoever guides someone to goodness will have a reward like one who did it.&rdquo;
            </p>
            <p className="mt-2 text-xs text-[var(--foreground-muted)]">
              — Sahih Muslim
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="border-b border-[var(--gold)]/20 bg-[var(--background-secondary)] py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {IMPACT_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 text-2xl">{stat.icon}</div>
                <div className="text-2xl font-bold text-[var(--gold)]">{stat.value}</div>
                <div className="text-sm text-[var(--foreground-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-[var(--foreground)]">
              Choose Your <span className="text-[var(--gold)]">Contribution</span>
            </h2>
            <p className="text-[var(--foreground-muted)]">
              Every donation, big or small, makes a difference in spreading Islamic knowledge.
            </p>
          </div>

          {/* Tiers grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DONATION_TIERS.map((tier) => (
              <DonationTierCard key={tier.id} tier={tier} />
            ))}
          </div>

          {/* Custom amount */}
          <div className="mt-12 text-center">
            <p className="mb-4 text-[var(--foreground-muted)]">
              Want to contribute a different amount?
            </p>
            <div className="mx-auto flex max-w-md items-center gap-4">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">$</span>
                <input
                  type="number"
                  placeholder="Enter amount"
                  min="1"
                  className="w-full rounded-lg border border-[var(--gold)]/30 bg-[var(--background-secondary)] py-3 pl-8 pr-4 text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
                />
              </div>
              <button className="rounded-lg bg-[var(--gold)] px-6 py-3 font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--gold-hover)]">
                Donate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How Donations Help */}
      <section className="border-t border-[var(--gold)]/20 bg-[var(--background-secondary)] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-[var(--foreground)]">
            How Your Donation <span className="text-[var(--gold)]">Helps</span>
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-[var(--gold)]/20 bg-[var(--background)] p-6 text-center">
              <div className="mb-4 text-3xl">🖥️</div>
              <h3 className="mb-2 font-semibold text-[var(--foreground)]">Server & Hosting</h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Keep the platform running 24/7 with fast, reliable access worldwide.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--gold)]/20 bg-[var(--background)] p-6 text-center">
              <div className="mb-4 text-3xl">📚</div>
              <h3 className="mb-2 font-semibold text-[var(--foreground)]">Content & Research</h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Verify translations, add new collections, and ensure authenticity.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--gold)]/20 bg-[var(--background)] p-6 text-center">
              <div className="mb-4 text-3xl">✨</div>
              <h3 className="mb-2 font-semibold text-[var(--foreground)]">New Features</h3>
              <p className="text-sm text-[var(--foreground-muted)]">
                Build audio recitation, mobile apps, and more learning tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold text-[var(--foreground)]">
            Your Trust <span className="text-[var(--gold)]">Matters</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-3 rounded-lg border border-[var(--gold)]/20 bg-[var(--background-secondary)] p-4">
              <svg className="h-6 w-6 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium text-[var(--foreground)]">Secure Payments</span>
            </div>

            <div className="flex items-center justify-center gap-3 rounded-lg border border-[var(--gold)]/20 bg-[var(--background-secondary)] p-4">
              <svg className="h-6 w-6 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm font-medium text-[var(--foreground)]">Transparent Usage</span>
            </div>

            <div className="flex items-center justify-center gap-3 rounded-lg border border-[var(--gold)]/20 bg-[var(--background-secondary)] p-4">
              <svg className="h-6 w-6 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-[var(--foreground)]">Receipt Provided</span>
            </div>
          </div>

          {/* Contact */}
          <p className="mt-8 text-sm text-[var(--foreground-muted)]">
            Questions about donations?{" "}
            <Link href="/contact" className="text-[var(--gold)] hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
