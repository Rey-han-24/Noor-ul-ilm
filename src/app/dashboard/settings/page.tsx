/**
 * Dashboard Settings Page
 * User account settings and preferences
 * Styled with royal black & gold theme
 */

import { getCurrentUser } from '@/backend/lib/auth-server';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
          <span className="text-[var(--gold)]">✦</span> Settings
        </h1>
        <p className="text-[var(--foreground-muted)] mt-1">Manage your account preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1">Name</label>
            <input
              type="text"
              defaultValue={user.name}
              className="w-full px-4 py-2.5 border border-[var(--gold)]/20 rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]/50"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1">Email</label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full px-4 py-2.5 border border-[var(--gold)]/20 rounded-lg bg-[var(--background)] text-[var(--foreground)] focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]/50"
              disabled
            />
          </div>
        </div>
        <p className="text-sm text-[var(--foreground-muted)] mt-4">
          Profile editing coming soon.
        </p>
      </div>

      {/* Preferences */}
      <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--card-border)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Preferences</h2>
        <p className="text-[var(--foreground-muted)]">
          Preference settings will be available soon.
        </p>
      </div>
    </div>
  );
}
