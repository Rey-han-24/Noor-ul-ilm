/**
 * Search Page Layout
 * 
 * Server component wrapper that provides Header and Footer
 * for the client-side search functionality.
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </div>
  );
}
