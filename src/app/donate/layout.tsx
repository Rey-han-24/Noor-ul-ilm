/**
 * Donate Page Layout
 * 
 * Server component wrapper providing Header and Footer
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DonateLayout({
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
