/**
 * Admin New Collection Page
 * 
 * Form for creating a new hadith collection
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Collection form data structure
 */
interface CollectionFormData {
  name: string;
  nameArabic: string;
  slug: string;
  author: string;
  authorArabic: string;
  description: string;
  totalHadiths: number;
  order: number;
}

/**
 * Admin New Collection Page Component
 */
export default function NewCollectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CollectionFormData>({
    name: '',
    nameArabic: '',
    slug: '',
    author: '',
    authorArabic: '',
    description: '',
    totalHadiths: 0,
    order: 0,
  });

  /**
   * Generates a slug from the collection name
   */
  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Handles form field changes
   */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));

    // Auto-generate slug when name changes
    if (name === 'name') {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  }

  /**
   * Handles form submission
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.nameArabic || !formData.slug) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/collections');
      } else {
        setError(data.error || 'Failed to create collection');
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
          href="/admin/collections"
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
        >
          ← Back to Collections
        </Link>
        <h1 className="text-2xl font-bold">Add New Collection</h1>
        <p className="text-gray-600 mt-1">
          Create a new hadith collection to organize hadiths
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
        {/* English Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Collection Name (English) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Sahih al-Bukhari"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Arabic Name */}
        <div>
          <label
            htmlFor="nameArabic"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Collection Name (Arabic) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nameArabic"
            name="nameArabic"
            value={formData.nameArabic}
            onChange={handleChange}
            placeholder="صحيح البخاري"
            dir="rtl"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            URL Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="sahih-al-bukhari"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Used in URLs: /hadiths/{formData.slug || 'your-slug'}
          </p>
        </div>

        {/* Author (English) */}
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author Name (English)
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="e.g., Imam Muhammad al-Bukhari"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Author (Arabic) */}
        <div>
          <label
            htmlFor="authorArabic"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author Name (Arabic)
          </label>
          <input
            type="text"
            id="authorArabic"
            name="authorArabic"
            value={formData.authorArabic}
            onChange={handleChange}
            placeholder="الإمام محمد البخاري"
            dir="rtl"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Brief description of the collection..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Total Hadiths & Order */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="totalHadiths"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Total Hadiths (Approximate)
            </label>
            <input
              type="number"
              id="totalHadiths"
              name="totalHadiths"
              value={formData.totalHadiths}
              onChange={handleChange}
              min={0}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label
              htmlFor="order"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Display Order
            </label>
            <input
              type="number"
              id="order"
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
            {loading ? 'Creating...' : 'Create Collection'}
          </button>
          <Link
            href="/admin/collections"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
