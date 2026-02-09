import type { Metadata, Viewport } from "next";
import { Amiri, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/frontend/components/ThemeProvider";

/**
 * Inter - Clean, modern font for English/UI text
 * Great readability for body text and interface elements
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Amiri - Beautiful Arabic font for Quran and Islamic text
 * Designed specifically for Arabic script with proper ligatures
 */
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

/**
 * Viewport configuration for mobile optimization
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

/**
 * Metadata for SEO and social sharing
 * Comprehensive setup for Google ranking and social media
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://noorulilm.com"),
  title: {
    default: "Noor ul Ilm - نور العلم | Quran & Hadith Online",
    template: "%s | Noor ul Ilm",
  },
  description:
    "Read the Holy Quran with translations, explore authentic Hadith collections (Bukhari, Muslim, Tirmidhi), and deepen your Islamic knowledge. Free online Islamic resource.",
  keywords: [
    "Quran online",
    "Quran translation",
    "Hadith collection",
    "Sahih Bukhari",
    "Sahih Muslim",
    "Islamic teachings",
    "Islam",
    "Muslim",
    "Noor ul Ilm",
    "نور العلم",
    "Quran Arabic",
    "Hadith search",
    "Islamic resource",
    "Read Quran",
    "Surah",
    "Ayah",
  ],
  authors: [{ name: "Noor ul Ilm", url: "https://noorulilm.com" }],
  creator: "Noor ul Ilm",
  publisher: "Noor ul Ilm",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_SA", "ur_PK"],
    url: "/",
    siteName: "Noor ul Ilm",
    title: "Noor ul Ilm - نور العلم | Quran & Hadith Online",
    description: "Read the Holy Quran with translations and explore authentic Hadith collections. Your free Islamic resource.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Noor ul Ilm - Light of Knowledge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noor ul Ilm - Quran & Hadith Online",
    description: "Read the Holy Quran with translations and explore authentic Hadith collections.",
    images: ["/og-image.png"],
    creator: "@noorulilm",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when ready
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  category: "Religion",
  classification: "Islamic Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Structured Data for Islamic Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Noor ul Ilm",
              alternateName: "نور العلم",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://noorulilm.com",
              description: "Read the Holy Quran with translations and explore authentic Hadith collections.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://noorulilm.com"}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "Noor ul Ilm",
                logo: {
                  "@type": "ImageObject",
                  url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://noorulilm.com"}/logo.png`,
                },
              },
            }),
          }}
        />
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} ${amiri.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
