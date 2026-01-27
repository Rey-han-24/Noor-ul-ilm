/**
 * User Dashboard - Main Overview Page
 * Shows user stats, quick actions, and profile info
 * Styled with royal black & gold theme
 */

import Link from 'next/link';
import { getCurrentUser, isAdmin } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const userIsAdmin = isAdmin(user);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
          Assalamu Alaikum, {user.name}! <span className="text-[var(--gold)]">✦</span>
        </h1>
        <p className="text-[var(--foreground-muted)] mt-2">
          Welcome to your dashboard. Continue your journey of learning.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)] hover:border-[var(--gold)]/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center text-2xl">
              📖
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--gold)]">114</p>
              <p className="text-sm text-[var(--foreground-muted)]">Surahs to Explore</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)] hover:border-[var(--gold)]/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center text-2xl">
              📚
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--gold)]">10</p>
              <p className="text-sm text-[var(--foreground-muted)]">Hadith Collections</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)] hover:border-[var(--gold)]/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center text-2xl">
              🔖
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--gold)]">0</p>
              <p className="text-sm text-[var(--foreground-muted)]">Your Bookmarks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <span className="text-[var(--gold)]">✦</span> Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/quran"
            className="bg-[var(--card-bg)] rounded-xl p-5 border border-[var(--card-border)] hover:border-[var(--gold)] transition-all group"
          >
            <div className="text-2xl mb-3">📖</div>
            <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
              Read Quran
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">Continue reading</p>
          </Link>

          <Link
            href="/hadith"
            className="bg-[var(--card-bg)] rounded-xl p-5 border border-[var(--card-border)] hover:border-[var(--gold)] transition-all group"
          >
            <div className="text-2xl mb-3">📚</div>
            <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
              Explore Hadith
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">Browse collections</p>
          </Link>

          <Link
            href="/search"
            className="bg-[var(--card-bg)] rounded-xl p-5 border border-[var(--card-border)] hover:border-[var(--gold)] transition-all group"
          >
            <div className="text-2xl mb-3">🔍</div>
            <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
              Search
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">Find verses & hadiths</p>
          </Link>

          <Link
            href="/dashboard/settings"
            className="bg-[var(--card-bg)] rounded-xl p-5 border border-[var(--card-border)] hover:border-[var(--gold)] transition-all group"
          >
            <div className="text-2xl mb-3">⚙️</div>
            <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
              Settings
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">Account preferences</p>
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <span className="text-[var(--gold)]">✦</span> Your Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between py-3 border-b border-[var(--gold)]/10">
            <span className="text-[var(--foreground-muted)]">Name</span>
            <span className="font-medium text-[var(--foreground)]">{user.name}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--gold)]/10">
            <span className="text-[var(--foreground-muted)]">Email</span>
            <span className="font-medium text-[var(--foreground)]">{user.email}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--gold)]/10">
            <span className="text-[var(--foreground-muted)]">Role</span>
            <span className={`font-medium px-2.5 py-1 rounded-full text-xs border ${
              userIsAdmin 
                ? 'bg-[var(--gold)]/15 text-[var(--gold)] border-[var(--gold)]/30' 
                : 'bg-[var(--foreground-muted)]/10 text-[var(--foreground-secondary)] border-[var(--foreground-muted)]/20'
            }`}>
              {user.role}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--gold)]/10">
            <span className="text-[var(--foreground-muted)]">Member Since</span>
            <span className="font-medium text-[var(--foreground)]">January 2026</span>
          </div>
        </div>
      </div>

      {/* Admin Quick Access */}
      {userIsAdmin && (
        <div className="bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] rounded-xl p-6 text-[var(--primary)]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">⚡</span>
            <h2 className="text-lg font-bold">Admin Quick Access</h2>
          </div>
          <p className="opacity-80 mb-4 text-sm">
            You have administrator privileges. Manage content from the sidebar or use the quick links below.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/admin"
              className="bg-[var(--primary)]/20 hover:bg-[var(--primary)]/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              📊 Overview
            </Link>
            <Link
              href="/dashboard/admin/collections"
              className="bg-[var(--primary)]/20 hover:bg-[var(--primary)]/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              📚 Collections
            </Link>
            <Link
              href="/dashboard/admin/hadiths"
              className="bg-[var(--primary)]/20 hover:bg-[var(--primary)]/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              📝 Hadiths
            </Link>
            <Link
              href="/dashboard/admin/users"
              className="bg-[var(--primary)]/20 hover:bg-[var(--primary)]/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              👥 Users
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
