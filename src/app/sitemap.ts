/**
 * Sitemap for SEO
 * 
 * Generates a comprehensive sitemap for search engines
 * Includes all Quran surahs and Hadith collections
 */

import { MetadataRoute } from 'next';
import { SURAH_LIST } from '@/shared/types/quran';
import prisma from '@/backend/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noorulilm.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/quran`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hadith`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Quran surah pages (all 114 surahs)
  const quranPages: MetadataRoute.Sitemap = SURAH_LIST.map((surah) => ({
    url: `${baseUrl}/quran/${surah.number}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Hadith collection pages from database
  let hadithPages: MetadataRoute.Sitemap = [];
  try {
    const collections = await prisma.hadithCollection.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    hadithPages = collections.map((collection) => ({
      url: `${baseUrl}/hadith/${collection.slug}`,
      lastModified: collection.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching hadith collections for sitemap:', error);
  }

  return [...staticPages, ...quranPages, ...hadithPages];
}
