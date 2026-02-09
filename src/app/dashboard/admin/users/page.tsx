/**
 * Admin Users Management
 * Styled with royal black & gold theme
 */

import { getCurrentUser, isAdmin } from '@/backend/lib/auth-server';
import { redirect } from 'next/navigation';
import prisma from '@/backend/lib/prisma';

export default async function AdminUsersPage() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
          <span className="text-[var(--gold)]">✦</span> Users
        </h1>
        <p className="text-[var(--foreground-muted)] mt-1">View and manage user accounts</p>
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--background-tertiary)] border-b border-[var(--gold)]/20">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--gold)] uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--gold)]/10">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-[var(--gold)]/5 transition-colors">
                <td className="px-6 py-4 font-medium text-[var(--foreground)]">{u.name}</td>
                <td className="px-6 py-4 text-[var(--foreground-secondary)]">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    u.role === 'SUPER_ADMIN' ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' :
                    u.role === 'ADMIN' ? 'bg-[var(--gold)]/15 text-[var(--gold)] border-[var(--gold)]/30' :
                    'bg-[var(--foreground-muted)]/10 text-[var(--foreground-muted)] border-[var(--foreground-muted)]/20'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-[var(--foreground-secondary)]">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-lg p-4">
        <p className="text-sm text-[var(--foreground-secondary)]">
          <strong className="text-[var(--gold)]">Note:</strong> To change a user&apos;s role, use Prisma Studio: <code className="bg-[var(--gold)]/15 px-1.5 py-0.5 rounded text-[var(--gold)]">npx prisma studio</code>
        </p>
      </div>
    </div>
  );
}
