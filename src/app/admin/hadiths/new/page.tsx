/**
 * Admin New Hadith Page
 * 
 * Form for manually adding a single hadith
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/** Collection option for dropdown */
interface CollectionOption {
  id: string;
  name: string;
  nameArabic: string;
}

/** Book option for dropdown */
interface BookOption {
  id: string;
  name: string;
  nameArabic: string;
  bookNumber: number | null;
}

/** Hadith form data */
interface HadithFormData {
  hadithNumber: number;
  arabicText: string;
  englishText: string;
  narrator: string;
  narratorChain: string;
  grade: string;
  gradeSource: string;
  bookId: string;
  chapter: string;
  reference: string;
  inBookReference: string;
}

const GRADE_OPTIONS = ['SAHIH', 'HASAN', 'DAIF', 'MAWDU', 'UNKNOWN'];

/**
 * Admin New Hadith Page Component
 */
export default function NewHadithPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [books, setBooks] = useState<BookOption[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  
  const [formData, setFormData] = useState<HadithFormData>({
    hadithNumber: 1,
    arabicText: '',
    englishText: '',
    narrator: '',
    narratorChain: '',
    grade: 'SAHIH',
    gradeSource: '',
    bookId: '',
    chapter: '',
    reference: '',
    inBookReference: '',
  });

  // Fetch collections on mount
  useEffect(() => {
    fetchCollections();
  }, []);

  // Fetch books when collection changes
  useEffect(() => {
    if (selectedCollection) {
      fetchBooks(selectedCollection);
    } else {
      setBooks([]);
    }
  }, [selectedCollection]);

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
   * Fetches books for a collection
   */
  async function fetchBooks(collectionId: string) {
    try {
      const response = await fetch(`/api/admin/books?collection=${collectionId}`);
      const data = await response.json();
      if (data.success) {
        setBooks(data.data);
      }
    } catch {
      console.error('Failed to fetch books');
    }
  }

  /**
   * Handles form field changes
   */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    
    // Validate required fields
    if (!formData.arabicText || !formData.bookId || !formData.hadithNumber) {
      setError('Please fill in all required fields (Arabic text, book, and hadith number)');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/hadiths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/hadiths');
      } else {
        setError(data.error || 'Failed to create hadith');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <Link
          href="/admin/hadiths"
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
        >
          ← Back to Hadiths
        </Link>
        <h1 className="text-2xl font-bold">Add New Hadith</h1>
        <p className="text-gray-600 mt-1">
          Manually add a single hadith to the database
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
        {/* Collection & Book Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCollection}
              onChange={(e) => {
                setSelectedCollection(e.target.value);
                setFormData((prev) => ({ ...prev, bookId: '' }));
              }}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book <span className="text-red-500">*</span>
            </label>
            <select
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
              disabled={!selectedCollection}
            >
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.bookNumber ? `${book.bookNumber}. ` : ''}{book.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hadith Number & Grade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hadith Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="hadithNumber"
              value={formData.hadithNumber}
              onChange={handleChange}
              min={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade <span className="text-red-500">*</span>
            </label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            >
              {GRADE_OPTIONS.map((grade) => (
                <option key={grade} value={grade}>
                  {grade.charAt(0) + grade.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade Source
            </label>
            <input
              type="text"
              name="gradeSource"
              value={formData.gradeSource}
              onChange={handleChange}
              placeholder="e.g., Al-Albani"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Arabic Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arabic Text <span className="text-red-500">*</span>
          </label>
          <textarea
            name="arabicText"
            value={formData.arabicText}
            onChange={handleChange}
            rows={5}
            dir="rtl"
            placeholder="أدخل النص العربي للحديث..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xl leading-loose"
            required
          />
        </div>

        {/* English Translation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            English Translation
          </label>
          <textarea
            name="englishText"
            value={formData.englishText}
            onChange={handleChange}
            rows={4}
            placeholder="Enter the English translation..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Narrator */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Narrator (Companion)
          </label>
          <input
            type="text"
            name="narrator"
            value={formData.narrator}
            onChange={handleChange}
            placeholder="e.g., Abu Hurairah"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Narrator Chain (Isnad) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chain of Narration (Isnad)
          </label>
          <textarea
            name="narratorChain"
            value={formData.narratorChain}
            onChange={handleChange}
            rows={2}
            placeholder="Full chain of narrators..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Chapter & References */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chapter
            </label>
            <input
              type="text"
              name="chapter"
              value={formData.chapter}
              onChange={handleChange}
              placeholder="Chapter name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference
            </label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="e.g., Bukhari 1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              In-Book Reference
            </label>
            <input
              type="text"
              name="inBookReference"
              value={formData.inBookReference}
              onChange={handleChange}
              placeholder="e.g., Book 1, Hadith 1"
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
            {loading ? 'Creating...' : 'Create Hadith'}
          </button>
          <Link
            href="/admin/hadiths"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
