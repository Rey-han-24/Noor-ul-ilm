/**
 * Admin Donations Management
 * Styled with royal black & gold theme
 */

import { getCurrentUser, isAdmin } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

export default async function AdminDonationsPage() {
  const user = await getCurrentUser();

  if (!user || !isAdmin(user)) {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
          <span className="text-[var(--gold)]">✦</span> Donations
        </h1>
        <p className="text-[var(--foreground-muted)] mt-1">Track and manage donations</p>
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--card-border)] text-center">
        <div className="text-4xl mb-4">💝</div>
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">No Donations Yet</h2>
        <p className="text-[var(--foreground-muted)] max-w-md mx-auto">
          Donation tracking will be available once the payment system is integrated.
        </p>
      </div>
    </div>
  );
}
