/**
 * Header Component - Navigation Bar (Server Component)
 *
 * Features:
 * - Royal brand logo with gold accent
 * - Centered desktop navigation links
 * - Theme toggle (dark/light mode)
 * - Shows Dashboard button when logged in, Login/Signup when not
 * - Mobile hamburger menu with slide-out drawer
 * - Fully responsive
 */

import Link from "next/link";
import { ThemeToggle } from "./ThemeProvider";
import { getCurrentUser } from "@/lib/auth-server";
import HeaderMobileMenu from "./HeaderMobileMenu";

/**
 * Navigation links for the app
 */
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/quran", label: "Quran" },
  { href: "/hadith", label: "Hadith" },
  { href: "/search", label: "Search" },
  { href: "/donate", label: "Donate" },
];

/**
 * Main Header component - Server Component for auth check
 */
export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--gold)]/20 bg-[var(--primary)]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]">
            <span className="text-base text-[var(--gold)]">☪</span>
          </div>
          <span className="brand-text text-base font-semibold tracking-[0.15em] text-[var(--gold)]">
            NOOR UL ILM
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--foreground)]/70 transition-colors hover:text-[var(--gold)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons + Theme Toggle */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          
          {user ? (
            /* Logged In - Show Dashboard Button */
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded border border-[var(--gold)] px-5 py-2 text-sm font-medium text-[var(--gold)] transition-all hover:bg-[var(--gold)] hover:text-[var(--primary)]"
            >
              <span>👤</span>
              <span>{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            /* Not Logged In - Show Login/Signup */
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--gold)] transition-colors hover:text-[var(--gold-light)]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded border border-[var(--gold)] px-5 py-2 text-sm font-medium text-[var(--gold)] transition-all hover:bg-[var(--gold)] hover:text-[var(--primary)]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu - Client Component */}
        <HeaderMobileMenu user={user} navLinks={navLinks} />
      </nav>
    </header>
  );
}
