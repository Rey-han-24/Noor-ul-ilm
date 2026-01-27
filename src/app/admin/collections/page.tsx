/**
 * Admin Collections Management Page
 * 
 * Page for viewing and managing hadith collections
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/** Collection data structure */
interface Collection {
  id: string;
  name: string;
  nameArabic: string;
  slug: string;
  author: string | null;
  authorArabic: string | null;
  description: string | null;
  totalHadiths: number;
  order: number;
  totalBooks?: number;
  actualHadithCount?: number;
}

/**
 * Admin Collections Page Component
 */
export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch collections on mount
  useEffect(() => {
    fetchCollections();
  }, []);

  /**
   * Fetches all collections from the API
   */
  async function fetchCollections() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/collections');
      const data = await response.json();

      if (data.success) {
        setCollections(data.data);
      } else {
        setError(data.error || 'Failed to fetch collections');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handles deleting a collection
   */
  async function handleDelete(collection: Collection) {
    if (!confirm(`Are you sure you want to delete "${collection.name}"? This will also delete all books and hadiths in this collection.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/collections/${collection.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setCollections((prev) => prev.filter((c) => c.id !== collection.id));
      } else {
        alert(data.error || 'Failed to delete collection');
      }
    } catch {
      alert('Failed to connect to server');
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hadith Collections</h1>
          <p className="text-gray-600 mt-1">
            Manage hadith collections like Sahih Bukhari, Muslim, etc.
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          + Add Collection
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      )}

      {/* Collections Grid */}
      {!loading && collections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              {/* Collection Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{collection.name}</h3>
                  <p className="text-xl text-emerald-700" dir="rtl">
                    {collection.nameArabic}
                  </p>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-emerald-100 text-emerald-700 rounded">
                  #{collection.order}
                </span>
              </div>

              {/* Author */}
              {collection.author && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Author:</span> {collection.author}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 my-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Books</p>
                  <p className="text-lg font-semibold">{collection.totalBooks || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hadiths</p>
                  <p className="text-lg font-semibold">
                    {collection.actualHadithCount || collection.totalHadiths}
                  </p>
                </div>
              </div>

              {/* Description */}
              {collection.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {collection.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Link
                  href={`/admin/collections/${collection.id}`}
                  className="flex-1 text-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  View Books
                </Link>
                <Link
                  href={`/admin/collections/${collection.id}/edit`}
                  className="flex-1 text-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(collection)}
                  className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && collections.length === 0 && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900">No collections yet</h3>
          <p className="text-gray-500 mt-2">
            Get started by adding your first hadith collection
          </p>
          <Link
            href="/admin/collections/new"
            className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Add Collection
          </Link>
        </div>
      )}
    </div>
  );
}
