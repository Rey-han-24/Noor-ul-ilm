/**
 * Admin Collections Management
 * Styled with royal black & gold theme
 */

import { getCurrentUser, isAdmin } from '@/backend/lib/auth-server';
import { redirect } from 'next/navigation';
import prisma from '@/backend/lib/prisma';
import Link from 'next/link';

export default async function AdminCollectionsPage() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  const collections = await prisma.hadithCollection.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <span className="text-[var(--gold)]">✦</span> Hadith Collections
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">Manage your hadith collections</p>
        </div>
        <Link
          href="/dashboard/admin/collections/new"
          className="bg-[var(--gold)] text-[var(--primary)] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--gold-light)] transition-colors"
        >
          + Add Collection
        </Link>
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--background-tertiary)] border-b border-[var(--gold)]/20">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">Compiler</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">Hadiths</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--gold)]/10">
            {collections.map((collection) => (
              <tr key={collection.id} className="hover:bg-[var(--gold)]/5 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-[var(--foreground)]">{collection.name}</div>
                    <div className="text-sm text-[var(--foreground-muted)]">{collection.nameArabic}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[var(--foreground-secondary)]">{collection.compiler}</td>
                <td className="px-6 py-4 text-[var(--foreground-secondary)]">{collection.totalHadiths}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/admin/collections/${collection.id}/edit`}
                    className="text-[var(--gold)] hover:text-[var(--gold-light)] text-sm font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
