/**
 * Quran Index Page
 * 
 * Redirects to Surah Al-Fatihah (1) by default.
 * The sidebar provides navigation to all Surahs.
 */

import { redirect } from "next/navigation";

export const metadata = {
  title: "Al-Quran | Noor ul Ilm",
  description: "Read the Holy Quran with translations in multiple languages. Browse all 114 Surahs.",
};

export default function QuranPage() {
  // Redirect to Surah Al-Fatihah by default
  redirect("/quran/1");
}
