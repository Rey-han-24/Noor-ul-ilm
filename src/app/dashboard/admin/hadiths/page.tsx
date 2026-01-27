/**
 * Admin Hadiths Management
 * Styled with royal black & gold theme
 */

import { getCurrentUser, isAdmin } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminHadithsPage() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  const hadiths = await prisma.hadith.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      collection: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <span className="text-[var(--gold)]">✦</span> Hadiths
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">Manage hadith entries</p>
        </div>
        <Link
          href="/dashboard/admin/hadiths/new"
          className="bg-[var(--gold)] text-[var(--primary)] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--gold-light)] transition-colors"
        >
          + Add Hadith
        </Link>
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--background-tertiary)] border-b border-[var(--gold)]/20">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">Reference</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">Collection</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">Grade</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--gold)]/10">
            {hadiths.map((hadith) => (
              <tr key={hadith.id} className="hover:bg-[var(--gold)]/5 transition-colors">
                <td className="px-6 py-4 font-medium text-[var(--foreground)]">
                  {hadith.reference || `Hadith #${hadith.hadithNumber}`}
                </td>
                <td className="px-6 py-4 text-[var(--foreground-secondary)]">{hadith.collection.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    hadith.grade === 'SAHIH' ? 'bg-green-500/15 text-green-400 border-green-500/30' :
                    hadith.grade === 'HASAN' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                    hadith.grade === 'DAIF' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                    'bg-[var(--foreground-muted)]/10 text-[var(--foreground-muted)] border-[var(--foreground-muted)]/20'
                  }`}>
                    {hadith.grade}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/admin/hadiths/${hadith.id}/edit`}
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
