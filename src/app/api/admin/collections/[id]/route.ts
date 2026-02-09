/**
 * API Route: Individual Collection Operations
 * 
 * GET /api/admin/collections/[id] - Get a single collection with books
 * PUT /api/admin/collections/[id] - Update a collection
 * DELETE /api/admin/collections/[id] - Delete a collection
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/db';

/** Route parameters */
interface RouteParams {
  params: Promise<{ id: string }>;
}

/** Request body for updating a collection */
interface UpdateCollectionBody {
  name?: string;
  nameArabic?: string;
  slug?: string;
  compiler?: string;
  compilerArabic?: string;
  description?: string;
  totalHadiths?: number;
}

/**
 * GET /api/admin/collections/[id]
 * Retrieves a single collection with its books
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const collection = await prisma.hadithCollection.findUnique({
      where: { id },
      include: {
        books: {
          include: {
            _count: {
              select: {
                hadiths: true,
              },
            },
          },
          orderBy: { bookNumber: 'asc' },
        },
      },
    });

    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: collection });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/collections/[id]
 * Updates an existing collection
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body: UpdateCollectionBody = await request.json();

    // Check if collection exists
    const existingCollection = await prisma.hadithCollection.findUnique({
      where: { id },
    });

    if (!existingCollection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Check if slug is being changed and already exists
    if (body.slug && body.slug !== existingCollection.slug) {
      const slugExists = await prisma.hadithCollection.findUnique({
        where: { slug: body.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'A collection with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // Update the collection
    const collection = await prisma.hadithCollection.update({
      where: { id },
      data: {
        name: body.name,
        nameArabic: body.nameArabic,
        slug: body.slug,
        compiler: body.compiler,
        compilerArabic: body.compilerArabic,
        description: body.description,
        totalHadiths: body.totalHadiths,
      },
    });

    return NextResponse.json({ success: true, data: collection });
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update collection' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/collections/[id]
 * Deletes a collection and all its books and hadiths
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Check if collection exists
    const existingCollection = await prisma.hadithCollection.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
    });

    if (!existingCollection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Delete the collection (cascade will delete books and hadiths)
    await prisma.hadithCollection.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Collection "${existingCollection.name}" deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete collection' },
      { status: 500 }
    );
  }
}
