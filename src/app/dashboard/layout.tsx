/**
 * Dashboard Layout
 * Provides consistent sidebar navigation for all dashboard pages
 * Integrates with main site's royal black & gold theme
 */

import { redirect } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/backend/lib/auth-server';
import Header from '@/frontend/components/Header';
import DashboardSidebar from '@/frontend/components/dashboard/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  const userIsAdmin = isAdmin(user);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Main Site Header - Same as homepage */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar user={user} isAdmin={userIsAdmin} />

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-73px)]">
          <div className="mx-auto max-w-6xl p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
