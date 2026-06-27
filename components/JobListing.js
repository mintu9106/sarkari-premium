'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import TranslateText from '@/components/TranslateText';
const getJobUrl = (category, slug) => {
  if (category === 'Admit Cards') {
    return `/admit-cards/${slug}`;
  }
  if (category === 'Results') {
    return `/results/${slug}`;
  }
  if (category === 'Govt Schemes') {
    return `/gov-schemes/${slug}`;
  }
  return `/jobs/${slug}`;
};

export default function JobListing({ initialJobs = [], categoryType = 'Jobs', title, subtitle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(categoryType === 'Jobs'); // Only default to active-only for jobs

  // Helper to determine if a job is active
  const isActive = (job) => {
    const isJobCat = ['Central Govt Jobs', 'State-wise Jobs', 'District-wise Jobs'].includes(job.category);
    if (!isJobCat) return true; // Admit cards and results don't expire in the same way as job deadlines

    if (!job.important_dates || !job.important_dates.end_date) return true;
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expiry = new Date(job.important_dates.end_date);
      expiry.setHours(0, 0, 0, 0);
      return expiry >= today;
    } catch (e) {
      return true;
    }
  };

  // Filter and search jobs
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      // 1. Filter by active state if checked
      if (showActiveOnly && !isActive(job)) {
        return false;
      }

      // 2. Filter by search query
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        job.title.toLowerCase().includes(query) ||
        job.department.toLowerCase().includes(query) ||
        (job.state && job.state.toLowerCase().includes(query)) ||
        (job.district && job.district.toLowerCase().includes(query))
      );
    });
  }, [initialJobs, searchQuery, showActiveOnly]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            <TranslateText text={title} />
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            <TranslateText text={subtitle} />
          </p>
        </div>

        {/* Total Count Badge */}
        <div className="self-start md:self-auto bg-amber-500/10 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold px-3 py-1 rounded-full">
          <span className="font-extrabold">{filteredJobs.length}</span> <TranslateText text="Items Found" />
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-[var(--card-bg)] p-4 rounded-xl border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder={`Search ${categoryType.toLowerCase()} by title, department, or state...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Active Toggle Switch */}
        {categoryType === 'Jobs' && (
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
            <span className="text-xs font-bold text-gray-650 dark:text-gray-400">
              <TranslateText text="Show Active Only" />
            </span>
            <button
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                showActiveOnly ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  showActiveOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Listing Grid */}
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm divide-y divide-[var(--border-color)]">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const expired = !isActive(job);
            return (
              <Link
                key={job.id}
                href={getJobUrl(job.category, job.slug)}
                className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <h2 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors flex-1">
                    <TranslateText text={job.title} />
                  </h2>

                  {/* Status Badge */}
                  {categoryType === 'Jobs' && (
                    <span
                      className={`self-start sm:self-auto text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                        expired
                          ? 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-500/10'
                          : 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-500/10'
                      }`}
                    >
                      <TranslateText text={expired ? 'Expired' : 'Active'} />
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-505 dark:text-gray-400 mt-1 max-w-3xl leading-relaxed">
                  <TranslateText text={job.overview ? job.overview.substring(0, 160) + '...' : ''} />
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-[10px] text-gray-400">
                  <span className="font-semibold text-gray-500">
                    <TranslateText text={job.department} />
                  </span>
                  <span>•</span>
                  {categoryType === 'Jobs' ? (
                    <span className={expired ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-400'}>
                      <TranslateText text="Apply Before" />: {job.important_dates?.end_date || 'N/A'}
                    </span>
                  ) : categoryType === 'Admit Cards' ? (
                    <span>
                      <TranslateText text="Release Date" />: {job.important_dates?.start_date || 'N/A'}
                    </span>
                  ) : (
                    <span>
                      <TranslateText text="Declared Date" />: {job.important_dates?.start_date || 'N/A'}
                    </span>
                  )}
                  {job.state && (
                    <>
                      <span>•</span>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-350 px-1.5 py-0.5 rounded">
                        <TranslateText text={job.state} />
                      </span>
                    </>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="p-12 text-center text-sm text-gray-500">
            <TranslateText text="No matches found for your search filters." />
          </div>
        )}
      </div>
    </div>
  );
}
