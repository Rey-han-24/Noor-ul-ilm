/**
 * Header Mobile Menu - Client Component
 * Handles mobile navigation with hamburger menu
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import type { SafeUser } from "@/shared/utils/auth";

interface HeaderMobileMenuProps {
  user: SafeUser | null;
  navLinks: { href: string; label: string }[];
}

/**
 * Hamburger menu icon component
 */
function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="flex h-6 w-6 flex-col items-center justify-center gap-1.5">
      <span
        className={`h-0.5 w-6 bg-[var(--gold)] transition-all duration-300 ${
          isOpen ? "translate-y-2 rotate-45" : ""
        }`}
      />
      <span
        className={`h-0.5 w-6 bg-[var(--gold)] transition-all duration-300 ${
          isOpen ? "opacity-0" : ""
        }`}
      />
      <span
        className={`h-0.5 w-6 bg-[var(--gold)] transition-all duration-300 ${
          isOpen ? "-translate-y-2 -rotate-45" : ""
        }`}
      />
    </div>
  );
}

export default function HeaderMobileMenu({ user, navLinks }: HeaderMobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="flex items-center justify-center md:hidden"
        onClick={toggleMobileMenu}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
      >
        <HamburgerIcon isOpen={isMobileMenuOpen} />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-72 transform bg-[var(--primary)] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between border-b border-[var(--gold)]/20 px-6 py-4">
          <span className="brand-text text-lg font-bold text-[var(--gold)]">Menu</span>
          <button
            onClick={closeMobileMenu}
            className="text-2xl text-[var(--gold)] hover:text-[var(--gold-light)]"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <div className="flex flex-col px-6 py-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className="border-b border-[var(--gold)]/10 py-4 text-base font-medium text-white/90 transition-colors hover:text-[var(--gold)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Auth Buttons */}
        <div className="flex flex-col gap-3 px-6">
          {user ? (
            /* Logged In */
            <Link
              href="/dashboard"
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 rounded-lg bg-[var(--gold)] py-3 text-center text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--gold-light)]"
            >
              <span>👤</span>
              <span>Dashboard</span>
            </Link>
          ) : (
            /* Not Logged In */
            <>
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="rounded-lg border-2 border-[var(--gold)]/50 py-3 text-center text-sm font-medium text-white/90 transition-all hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={closeMobileMenu}
                className="rounded-lg bg-[var(--gold)] py-3 text-center text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--gold-light)]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-8 left-0 right-0 px-6 text-center">
          <p className="arabic-text text-lg text-[var(--gold)]/60">نور العلم</p>
          <p className="mt-1 text-xs text-white/40">Light of Knowledge</p>
        </div>
      </div>
    </>
  );
}
