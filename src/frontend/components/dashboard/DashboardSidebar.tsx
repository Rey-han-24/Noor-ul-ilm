/**
 * Dashboard Sidebar Component
 * Client component for interactive navigation
 * Matches the royal black & gold theme of the main site
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SafeUser } from "@/shared/utils/auth";

interface DashboardSidebarProps {
  user: SafeUser;
  isAdmin: boolean;
}

/** Navigation item type */
interface NavItem {
  href: string;
  label: string;
  icon: string;
}

/** User navigation items */
const userNavItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "🏠" },
  { href: "/dashboard/bookmarks", label: "Bookmarks", icon: "🔖" },
  { href: "/dashboard/history", label: "Reading History", icon: "📜" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

/** Admin navigation items */
const adminNavItems: NavItem[] = [
  { href: "/dashboard/admin", label: "Admin Overview", icon: "📊" },
  { href: "/dashboard/admin/collections", label: "Collections", icon: "📚" },
  { href: "/dashboard/admin/hadiths", label: "Hadiths", icon: "📝" },
  { href: "/dashboard/admin/users", label: "Users", icon: "👥" },
  { href: "/dashboard/admin/donations", label: "Donations", icon: "💝" },
];

export default function DashboardSidebar({ user, isAdmin }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r lg:border-[var(--gold)]/20 lg:bg-[var(--background-secondary)] lg:min-h-[calc(100vh-73px)]">
      {/* User Profile Section */}
      <div className="p-5 border-b border-[var(--gold)]/10">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)] font-semibold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--foreground)] truncate">{user.name}</p>
            <p className="text-xs text-[var(--foreground-muted)] truncate">{user.email}</p>
          </div>
        </div>
        {isAdmin && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-1 bg-[var(--gold)]/15 text-[var(--gold)] text-xs font-medium px-2.5 py-1 rounded-full border border-[var(--gold)]/30">
              <span>✦</span> Administrator
            </span>
          </div>
        )}
      </div>

      {/* User Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-[var(--gold)] uppercase tracking-wider mb-3 px-3">
          My Account
        </p>
        {userNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30"
                  : "text-[var(--foreground-secondary)] hover:bg-[var(--gold)]/5 hover:text-[var(--gold)]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Admin Section */}
        {isAdmin && (
          <>
            <div className="pt-6 pb-2">
              <p className="text-xs font-semibold text-[var(--gold)] uppercase tracking-wider px-3">
                Administration
              </p>
            </div>
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30"
                      : "text-[var(--foreground-secondary)] hover:bg-[var(--gold)]/5 hover:text-[var(--gold)]"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-[var(--gold)]/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--foreground-secondary)] hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/30"
        >
          <span className="text-base">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
