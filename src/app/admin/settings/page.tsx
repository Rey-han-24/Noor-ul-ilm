/**
 * Admin Settings Page
 * 
 * Page for managing site-wide settings
 */

'use client';

import { useState, useEffect } from 'react';

/** Settings form data */
interface SettingsData {
  site_name: string;
  site_description: string;
  contact_email: string;
  donation_enabled: string;
  donation_goal: string;
  maintenance_mode: string;
  analytics_id: string;
  footer_text: string;
}

const DEFAULT_SETTINGS: SettingsData = {
  site_name: 'Noor ul Ilm',
  site_description: 'Your gateway to Islamic authentic resources',
  contact_email: '',
  donation_enabled: 'true',
  donation_goal: '10000',
  maintenance_mode: 'false',
  analytics_id: '',
  footer_text: '© 2025 Noor ul Ilm. All rights reserved.',
};

/**
 * Admin Settings Page Component
 */
export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  /**
   * Fetches current settings
   */
  async function fetchSettings() {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (data.success) {
        setSettings((prev) => ({
          ...prev,
          ...data.data,
        }));
      }
    } catch {
      console.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handles form field changes
   */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccess(null);
  }

  /**
   * Handles form submission
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Settings saved successfully!');
      } else {
        setError(data.error || 'Failed to save settings');
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure global settings for Noor ul Ilm
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
            General Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                name="site_name"
                value={settings.site_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Description
              </label>
              <textarea
                name="site_description"
                value={settings.site_description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={settings.contact_email}
                onChange={handleChange}
                placeholder="contact@noorulilm.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Footer Text
              </label>
              <input
                type="text"
                name="footer_text"
                value={settings.footer_text}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Donation Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
            Donation Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enable Donations
              </label>
              <select
                name="donation_enabled"
                value={settings.donation_enabled}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donation Goal ($)
              </label>
              <input
                type="number"
                name="donation_goal"
                value={settings.donation_goal}
                onChange={handleChange}
                min={0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
            Advanced Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Mode
              </label>
              <select
                name="maintenance_mode"
                value={settings.maintenance_mode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="false">Disabled (Site is live)</option>
                <option value="true">Enabled (Site is in maintenance)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                When enabled, visitors will see a maintenance page
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Analytics ID
              </label>
              <input
                type="text"
                name="analytics_id"
                value={settings.analytics_id}
                onChange={handleChange}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Database Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
            Database Actions
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">
                Seed Database
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                Populate the database with initial hadith collections. Run this once after setting up.
              </p>
              <p className="text-xs text-yellow-600 font-mono bg-yellow-100 p-2 rounded">
                npm run db:seed
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                Prisma Studio
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Open Prisma Studio to view and edit database records directly.
              </p>
              <p className="text-xs text-blue-600 font-mono bg-blue-100 p-2 rounded">
                npm run db:studio
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
