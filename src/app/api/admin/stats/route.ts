/**
 * API Route: Admin Dashboard Statistics
 * 
 * GET /api/admin/stats - Get dashboard statistics
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/admin/stats
 * Returns statistics for the admin dashboard
 */
export async function GET() {
  try {
    // Fetch all counts in parallel
    const [
      totalHadiths,
      totalCollections,
      totalBooks,
      totalUsers,
      totalDonations,
      recentHadiths,
      recentDonations,
    ] = await Promise.all([
      prisma.hadith.count(),
      prisma.hadithCollection.count(),
      prisma.hadithBook.count(),
      prisma.user.count(),
      prisma.donation.count(),
      prisma.hadith.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          hadithNumber: true,
          createdAt: true,
          book: {
            select: {
              name: true,
              collection: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.donation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          donorName: true,
          createdAt: true,
        },
      }),
    ]);

    // Calculate donation sum
    const donationSum = await prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'COMPLETED',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          hadiths: totalHadiths,
          collections: totalCollections,
          books: totalBooks,
          users: totalUsers,
          donations: totalDonations,
        },
        totalDonationAmount: donationSum._sum.amount || 0,
        recentHadiths,
        recentDonations,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
