/**
 * Admin Hadith Import Page
 * 
 * Allows bulk importing hadiths from JSON files or external APIs.
 */

"use client";

import { useState } from "react";
import Link from "next/link";

type ImportSource = "json" | "api" | "csv";
type ImportStatus = "idle" | "uploading" | "processing" | "complete" | "error";

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
}

export default function ImportHadithsPage() {
  const [source, setSource] = useState<ImportSource>("json");
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [selectedCollection, setSelectedCollection] = useState("bukhari");
  const [apiUrl, setApiUrl] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    
    // Simulate upload and processing
    setTimeout(() => {
      setStatus("processing");
      setTimeout(() => {
        setStatus("complete");
        setResult({
          total: 150,
          imported: 148,
          skipped: 2,
          errors: ["Hadith #45: Missing Arabic text", "Hadith #89: Invalid grade value"],
        });
      }, 2000);
    }, 1000);
  };

  const handleApiImport = async () => {
    setStatus("processing");
    
    // Simulate API import
    setTimeout(() => {
      setStatus("complete");
      setResult({
        total: 7563,
        imported: 7563,
        skipped: 0,
        errors: [],
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/admin/hadiths" className="hover:text-emerald-600">
              Hadiths
            </Link>
            <span>/</span>
            <span className="text-gray-700">Import</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Import Hadiths</h1>
          <p className="mt-1 text-gray-500">Bulk import hadiths from various sources</p>
        </div>
      </div>

      {/* Source Selection */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">Select Import Source</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => setSource("json")}
            className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all ${
              source === "json"
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-8 w-8 ${source === "json" ? "text-emerald-600" : "text-gray-400"}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <span className={`font-medium ${source === "json" ? "text-emerald-700" : "text-gray-700"}`}>
              JSON File
            </span>
            <span className="text-sm text-gray-500">Upload a JSON file</span>
          </button>

          <button
            onClick={() => setSource("api")}
            className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all ${
              source === "api"
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-8 w-8 ${source === "api" ? "text-emerald-600" : "text-gray-400"}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <span className={`font-medium ${source === "api" ? "text-emerald-700" : "text-gray-700"}`}>
              External API
            </span>
            <span className="text-sm text-gray-500">Fetch from hadith API</span>
          </button>

          <button
            onClick={() => setSource("csv")}
            className={`flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all ${
              source === "csv"
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-8 w-8 ${source === "csv" ? "text-emerald-600" : "text-gray-400"}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
            </svg>
            <span className={`font-medium ${source === "csv" ? "text-emerald-700" : "text-gray-700"}`}>
              CSV File
            </span>
            <span className="text-sm text-gray-500">Upload a CSV spreadsheet</span>
          </button>
        </div>
      </div>

      {/* Import Form based on source */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        {source === "json" && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Upload JSON File</h2>
            <p className="text-sm text-gray-500">
              Upload a JSON file containing hadith data. The file should have an array of hadith objects.
            </p>
            
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Target Collection
              </label>
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="bukhari">Sahih al-Bukhari</option>
                <option value="muslim">Sahih Muslim</option>
                <option value="tirmidhi">Jami at-Tirmidhi</option>
                <option value="abudawud">Sunan Abu Dawud</option>
                <option value="nasai">Sunan an-Nasa&apos;i</option>
                <option value="ibnmajah">Sunan Ibn Majah</option>
              </select>
            </div>

            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                <div className="mt-4">
                  <label className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">JSON files up to 50MB</p>
              </div>
            </div>
          </div>
        )}

        {source === "api" && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Import from External API</h2>
            <p className="text-sm text-gray-500">
              Fetch hadiths directly from an external hadith API (e.g., cdn.jsdelivr.net hadith-api).
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Collection to Import
                </label>
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="bukhari">Sahih al-Bukhari</option>
                  <option value="muslim">Sahih Muslim</option>
                  <option value="tirmidhi">Jami at-Tirmidhi</option>
                  <option value="abudawud">Sunan Abu Dawud</option>
                  <option value="nasai">Sunan an-Nasa&apos;i</option>
                  <option value="ibnmajah">Sunan Ibn Majah</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  API URL (Optional)
                </label>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://cdn.jsdelivr.net/..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleApiImport}
              disabled={status === "processing"}
              className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {status === "processing" ? "Importing..." : "Start Import"}
            </button>
          </div>
        )}

        {source === "csv" && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Upload CSV File</h2>
            <p className="text-sm text-gray-500">
              Upload a CSV file with columns: hadith_number, arabic_text, english_text, narrator, grade
            </p>
            
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                <div className="mt-4">
                  <label className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">CSV files up to 50MB</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Import Progress/Results */}
      {status !== "idle" && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-gray-900">Import Status</h2>

          {status === "uploading" && (
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
              <span className="text-gray-600">Uploading file...</span>
            </div>
          )}

          {status === "processing" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                <span className="text-gray-600">Processing hadiths...</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-600"></div>
              </div>
            </div>
          )}

          {status === "complete" && result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="font-medium">Import Complete!</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Total Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{result.total.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-green-600">Successfully Imported</p>
                  <p className="text-2xl font-bold text-green-700">{result.imported.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-orange-50 p-4">
                  <p className="text-sm text-orange-600">Skipped/Errors</p>
                  <p className="text-2xl font-bold text-orange-700">{result.skipped}</p>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <h3 className="mb-2 font-medium text-red-700">Errors:</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-red-600">
                    {result.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span className="font-medium">Import failed. Please try again.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
