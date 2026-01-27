/**
 * Admin New Book Page
 * 
 * Form for creating a new book within a collection
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

/** Collection option for dropdown */
interface CollectionOption {
  id: string;
  name: string;
  nameArabic: string;
}

/** Book form data */
interface BookFormData {
  name: string;
  nameArabic: string;
  collectionId: string;
  bookNumber: number;
  totalHadiths: number;
  order: number;
}

/**
 * Admin New Book Page Component
 */
export default function NewBookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCollection = searchParams.get('collection') || '';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  
  const [formData, setFormData] = useState<BookFormData>({
    name: '',
    nameArabic: '',
    collectionId: preselectedCollection,
    bookNumber: 1,
    totalHadiths: 0,
    order: 1,
  });

  // Fetch collections on mount
  useEffect(() => {
    fetchCollections();
  }, []);

  /**
   * Fetches all collections
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
   * Handles form field changes
   */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  }

  /**
   * Handles form submission
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name || !formData.nameArabic || !formData.collectionId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/books');
      } else {
        setError(data.error || 'Failed to create book');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <Link
          href="/admin/books"
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
        >
          ← Back to Books
        </Link>
        <h1 className="text-2xl font-bold">Add New Book</h1>
        <p className="text-gray-600 mt-1">
          Create a new book within a hadith collection
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
        {/* Collection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Collection <span className="text-red-500">*</span>
          </label>
          <select
            name="collectionId"
            value={formData.collectionId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a collection</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name} - {col.nameArabic}
              </option>
            ))}
          </select>
        </div>

        {/* English Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Name (English) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Book of Revelation"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Arabic Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Book Name (Arabic) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nameArabic"
            value={formData.nameArabic}
            onChange={handleChange}
            placeholder="كتاب بدء الوحي"
            dir="rtl"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Book Number, Total Hadiths, Order */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Number
            </label>
            <input
              type="number"
              name="bookNumber"
              value={formData.bookNumber}
              onChange={handleChange}
              min={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Hadiths
            </label>
            <input
              type="number"
              name="totalHadiths"
              value={formData.totalHadiths}
              onChange={handleChange}
              min={0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min={0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Book'}
          </button>
          <Link
            href="/admin/books"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
