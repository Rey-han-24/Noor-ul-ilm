/**
 * Quran Layout Component
 * 
 * Wraps all Quran pages with the Surah sidebar.
 * The sidebar is toggleable and shows by default.
 */

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/frontend/components/Header";
import Footer from "@/frontend/components/Footer";
import SurahSidebar from "@/frontend/components/quran/SurahSidebar";

export default function QuranLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Extract current surah number from pathname
  const surahMatch = pathname.match(/\/quran\/(\d+)/);
  const currentSurah = surahMatch ? parseInt(surahMatch[1]) : undefined;

  // Close sidebar on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on mobile after navigation
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header />

      <div className="flex flex-1">
        {/* Surah Sidebar */}
        <SurahSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          currentSurah={currentSurah}
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-80" : ""
          }`}
        >
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
