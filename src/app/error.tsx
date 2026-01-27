/**
 * Global Error Page
 * 
 * Displays when an unexpected error occurs.
 * Provides options to recover or report the issue.
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-4">
      <div className="text-center">
        {/* Icon */}
        <div className="mb-6 text-6xl">⚠️</div>
        
        {/* Title */}
        <h1 className="mb-4 text-3xl font-bold text-[var(--foreground)]">
          Something Went Wrong
        </h1>
        
        {/* Description */}
        <p className="mb-8 max-w-md text-[var(--foreground-muted)]">
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try again or return to the home page.
        </p>
        
        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mb-6 text-xs text-[var(--foreground-muted)]">
            Error ID: {error.digest}
          </p>
        )}
        
        {/* Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-[var(--gold)] px-6 py-3 font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--gold-hover)]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-[var(--gold)] px-6 py-3 font-semibold text-[var(--gold)] transition-colors hover:bg-[var(--gold)] hover:text-[var(--primary)]"
          >
            Go Home
          </Link>
        </div>
        
        {/* Support */}
        <p className="mt-8 text-sm text-[var(--foreground-muted)]">
          If this problem persists, please{" "}
          <Link href="/contact" className="text-[var(--gold)] hover:underline">
            contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
