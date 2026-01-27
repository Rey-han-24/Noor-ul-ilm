/**
 * Admin Books Management Page
 * 
 * Page for viewing and managing hadith books within collections
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/** Book data structure */
interface Book {
  id: string;
  name: string;
  nameArabic: string;
  bookNumber: number | null;
  totalHadiths: number;
  order: number;
  collection: {
    id: string;
    name: string;
    nameArabic: string;
  };
  _count: {
    hadiths: number;
  };
}

/** Collection for filter dropdown */
interface Collection {
  id: string;
  name: string;
  nameArabic: string;
}

/**
 * Admin Books Page Component
 */
export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCollection, setFilterCollection] = useState('');

  // Fetch data on mount
  useEffect(() => {
    fetchCollections();
    fetchBooks();
  }, []);

  // Re-fetch books when filter changes
  useEffect(() => {
    fetchBooks();
  }, [filterCollection]);

  /**
   * Fetches all collections for filter dropdown
   */
  async function fetchCollections() {
    try {
      const response = await fetch('/api/admin/collections');
      const data = await response.json();
      if (data.success) {
        setCollections(data.data);
      }
    } catch {
      console.error('Failed to fetch collections');
    }
  }

  /**
   * Fetches books with optional filter
   */
  async function fetchBooks() {
    try {
      setLoading(true);
      const url = filterCollection 
        ? `/api/admin/books?collection=${filterCollection}`
        : '/api/admin/books';
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setBooks(data.data);
      } else {
        setError(data.error || 'Failed to fetch books');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handles deleting a book
   */
  async function handleDelete(book: Book) {
    if (!confirm(`Are you sure you want to delete "${book.name}"? This will also delete all ${book._count.hadiths} hadiths in this book.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/books/${book.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setBooks((prev) => prev.filter((b) => b.id !== book.id));
      } else {
        alert(data.error || 'Failed to delete book');
      }
    } catch {
      alert('Failed to connect to server');
    }
  }

  // Group books by collection
  const booksByCollection = books.reduce((acc, book) => {
    const collectionId = book.collection.id;
    if (!acc[collectionId]) {
      acc[collectionId] = {
        collection: book.collection,
        books: [],
      };
    }
    acc[collectionId].books.push(book);
    return acc;
  }, {} as Record<string, { collection: Collection; books: Book[] }>);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hadith Books</h1>
          <p className="text-gray-600 mt-1">
            Manage books within each hadith collection
          </p>
        </div>
        <Link
          href="/admin/books/new"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          + Add Book
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Collection
        </label>
        <select
          value={filterCollection}
          onChange={(e) => setFilterCollection(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">All Collections</option>
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>
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

      {/* Books List */}
      {!loading && Object.keys(booksByCollection).length > 0 && (
        <div className="space-y-8">
          {Object.values(booksByCollection).map(({ collection, books: collectionBooks }) => (
            <div key={collection.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Collection Header */}
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100">
                <h2 className="font-semibold text-lg text-emerald-900">
                  {collection.name}
                </h2>
                <p className="text-emerald-700" dir="rtl">
                  {collection.nameArabic}
                </p>
              </div>

              {/* Books Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arabic Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hadiths
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {collectionBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.bookNumber || book.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {book.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap" dir="rtl">
                        <div className="text-sm text-gray-900">
                          {book.nameArabic}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {book._count.hadiths} hadiths
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/hadiths?book=${book.id}`}
                          className="text-emerald-600 hover:text-emerald-900 mr-4"
                        >
                          View Hadiths
                        </Link>
                        <Link
                          href={`/admin/books/${book.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(book)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && books.length === 0 && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-lg font-medium text-gray-900">No books yet</h3>
          <p className="text-gray-500 mt-2">
            {filterCollection 
              ? 'No books found in this collection'
              : 'Get started by adding your first book to a collection'
            }
          </p>
          <Link
            href="/admin/books/new"
            className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Add Book
          </Link>
        </div>
      )}
    </div>
  );
}
