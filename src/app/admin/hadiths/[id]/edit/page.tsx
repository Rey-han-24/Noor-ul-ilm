/**
 * Admin Edit Hadith Page
 * 
 * Form for editing an existing hadith
 */

'use client';

import { useState, useEffect, use } from 'react';
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
  collectionId: string;
}

/** Hadith data from API */
interface HadithData {
  id: string;
  hadithNumber: number;
  arabicText: string;
  englishText: string | null;
  narrator: string | null;
  narratorChain: string | null;
  grade: string;
  gradeSource: string | null;
  bookId: string;
  chapter: string | null;
  reference: string | null;
  inBookReference: string | null;
  book: {
    id: string;
    name: string;
    collectionId: string;
    collection: {
      id: string;
      name: string;
    };
  };
}

const GRADE_OPTIONS = ['SAHIH', 'HASAN', 'DAIF', 'MAWDU', 'UNKNOWN'];

/**
 * Admin Edit Hadith Page Component
 */
export default function EditHadithPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [books, setBooks] = useState<BookOption[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  
  const [formData, setFormData] = useState({
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

  // Fetch hadith and collections on mount
  useEffect(() => {
    fetchHadith();
    fetchCollections();
  }, [id]);

  // Fetch books when collection changes
  useEffect(() => {
    if (selectedCollection) {
      fetchBooks(selectedCollection);
    }
  }, [selectedCollection]);

  /**
   * Fetches the hadith data
   */
  async function fetchHadith() {
    try {
      const response = await fetch(`/api/admin/hadiths/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const hadith: HadithData = data.data;
        setFormData({
          hadithNumber: hadith.hadithNumber,
          arabicText: hadith.arabicText,
          englishText: hadith.englishText || '',
          narrator: hadith.narrator || '',
          narratorChain: hadith.narratorChain || '',
          grade: hadith.grade,
          gradeSource: hadith.gradeSource || '',
          bookId: hadith.bookId,
          chapter: hadith.chapter || '',
          reference: hadith.reference || '',
          inBookReference: hadith.inBookReference || '',
        });
        setSelectedCollection(hadith.book.collectionId);
      } else {
        setError('Hadith not found');
      }
    } catch {
      setError('Failed to fetch hadith');
    } finally {
      setLoading(false);
    }
  }

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
    
    if (!formData.arabicText || !formData.bookId || !formData.hadithNumber) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/admin/hadiths/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/hadiths');
      } else {
        setError(data.error || 'Failed to update hadith');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setSaving(false);
    }
  }

  /**
   * Handles deletion
   */
  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this hadith? This cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/hadiths/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/hadiths');
      } else {
        setError(data.error || 'Failed to delete hadith');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Edit Hadith</h1>
            <p className="text-gray-600 mt-1">
              Update hadith #{formData.hadithNumber}
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={saving}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            Delete Hadith
          </button>
        </div>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Narrator Chain */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chain of Narration (Isnad)
          </label>
          <textarea
            name="narratorChain"
            value={formData.narratorChain}
            onChange={handleChange}
            rows={2}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
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
