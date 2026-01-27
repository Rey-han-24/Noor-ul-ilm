/**
 * Admin Hadiths List Page
 * 
 * Lists all hadiths with filtering, pagination, and actions.
 */

"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data for hadiths (will be replaced with database data)
const MOCK_HADITHS = [
  {
    id: "1",
    hadithNumber: 1,
    collection: "Bukhari",
    primaryNarrator: "Umar bin Al-Khattab",
    englishText: "Actions are judged by intentions, and every person will get the reward according to what he has intended...",
    grade: "Sahih",
    bookNumber: 1,
  },
  {
    id: "2",
    hadithNumber: 2,
    collection: "Bukhari",
    primaryNarrator: "Ibn Umar",
    englishText: "Islam is based on five (pillars): to testify that there is no god but Allah...",
    grade: "Sahih",
    bookNumber: 1,
  },
  {
    id: "3",
    hadithNumber: 13,
    collection: "Bukhari",
    primaryNarrator: "Anas bin Malik",
    englishText: "None of you will have true faith until he loves for his brother what he loves for himself.",
    grade: "Sahih",
    bookNumber: 2,
  },
];

const COLLECTIONS = ["All", "Bukhari", "Muslim", "Tirmidhi", "Abu Dawud", "Nasai", "Ibn Majah"];
const GRADES = ["All", "Sahih", "Hasan", "Da'if", "Mawdu"];

export default function AdminHadithsPage() {
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHadiths = MOCK_HADITHS.filter((hadith) => {
    if (selectedCollection !== "All" && hadith.collection !== selectedCollection) return false;
    if (selectedGrade !== "All" && hadith.grade !== selectedGrade) return false;
    if (searchQuery && !hadith.englishText.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hadiths</h1>
          <p className="mt-1 text-gray-500">Manage hadith entries across all collections</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/hadiths/import"
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Import
          </Link>
          <Link
            href="/admin/hadiths/new"
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Hadith
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search hadiths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Collection Filter */}
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {COLLECTIONS.map((collection) => (
            <option key={collection} value={collection}>
              {collection === "All" ? "All Collections" : collection}
            </option>
          ))}
        </select>

        {/* Grade Filter */}
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {GRADES.map((grade) => (
            <option key={grade} value={grade}>
              {grade === "All" ? "All Grades" : grade}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Collection
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Narrator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Text Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Grade
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredHadiths.map((hadith) => (
              <tr key={hadith.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {hadith.hadithNumber}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {hadith.collection}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {hadith.primaryNarrator}
                </td>
                <td className="max-w-md truncate px-6 py-4 text-sm text-gray-500">
                  {hadith.englishText.substring(0, 80)}...
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      hadith.grade === "Sahih"
                        ? "bg-green-100 text-green-700"
                        : hadith.grade === "Hasan"
                        ? "bg-yellow-100 text-yellow-700"
                        : hadith.grade === "Da'if"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {hadith.grade}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/hadiths/${hadith.id}`}
                      className="text-gray-500 hover:text-emerald-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </Link>
                    <Link
                      href={`/admin/hadiths/${hadith.id}/edit`}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </Link>
                    <button className="text-gray-500 hover:text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{filteredHadiths.length}</span> of{" "}
            <span className="font-medium">7,563</span> results
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50">
              Previous
            </button>
            <button className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-500 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
