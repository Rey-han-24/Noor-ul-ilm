/**
 * Admin Dashboard Overview
 * Main admin panel with stats and quick actions
 * Styled with royal black & gold theme
 */

import { getCurrentUser, isAdmin } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  // Fetch stats
  const [collectionsCount, hadithsCount, usersCount] = await Promise.all([
    prisma.hadithCollection.count(),
    prisma.hadith.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
          <span className="text-[var(--gold)]">⚡</span> Admin Dashboard
        </h1>
        <p className="text-[var(--foreground-muted)] mt-1">Manage your Islamic content platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)]">
          <div className="text-3xl font-bold text-[var(--gold)]">{collectionsCount}</div>
          <div className="text-sm text-[var(--foreground-muted)]">Collections</div>
        </div>
        <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)]">
          <div className="text-3xl font-bold text-[var(--gold)]">{hadithsCount}</div>
          <div className="text-sm text-[var(--foreground-muted)]">Hadiths</div>
        </div>
        <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)]">
          <div className="text-3xl font-bold text-[var(--gold)]">{usersCount}</div>
          <div className="text-sm text-[var(--foreground-muted)]">Users</div>
        </div>
        <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)]">
          <div className="text-3xl font-bold text-[var(--gold)]">0</div>
          <div className="text-sm text-[var(--foreground-muted)]">Donations</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <span className="text-[var(--gold)]">✦</span> Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link
            href="/dashboard/admin/collections"
            className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)] hover:border-[var(--gold)] transition-all group"
          >
            <div className="text-2xl mb-3">📚</div>
            <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
              Manage Collections
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">Add, edit, or remove hadith collections</p>
          </Link>

          <Link
            href="/dashboard/admin/hadiths"
            className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)] hover:border-[var(--gold)] transition-all group"
          >
            <div className="text-2xl mb-3">📝</div>
            <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
              Manage Hadiths
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">Add, edit, or remove hadiths</p>
          </Link>

          <Link
            href="/dashboard/admin/users"
            className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)] hover:border-[var(--gold)] transition-all group"
          >
            <div className="text-2xl mb-3">👥</div>
            <h3 className="font-semibold text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors">
              Manage Users
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">View and manage user accounts</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
