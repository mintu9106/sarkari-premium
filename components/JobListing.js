'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import TranslateText from '@/components/TranslateText';
import { useLanguage } from '@/context/LanguageContext';
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
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(categoryType === 'Jobs'); // Only default to active-only for jobs
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    // Detect language dynamically based on context language
    if (language === 'hi') {
      recognition.lang = 'hi-IN';
    } else if (language === 'bn') {
      recognition.lang = 'bn-IN';
    } else {
      recognition.lang = 'en-IN';
    }

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const cleanedQuery = transcript.replace(/\.$/, '');
      setSearchQuery(cleanedQuery);
    };

    recognition.start();
  };

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
            placeholder={isListening ? "Listening... Speak now..." : `Search ${categoryType.toLowerCase()} by title, department, or state...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/35 focus:border-amber-500 transition-all"
          />
          {/* Voice Search Microphone Button */}
          <button
            onClick={startVoiceSearch}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-colors ${
              isListening 
                ? 'text-red-500 hover:text-red-650 animate-pulse' 
                : 'text-gray-400 hover:text-amber-500 dark:hover:text-amber-400'
            }`}
            title="Voice Search"
            type="button"
          >
            {isListening && (
              <span className="flex h-2 w-2 relative mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
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
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const expired = !isActive(job);
            
            // Determine hover highlights based on category
            const hoverTextClass = 
              categoryType === 'Admit Cards' 
                ? 'group-hover:text-blue-500 dark:group-hover:text-blue-400' 
                : categoryType === 'Results' 
                  ? 'group-hover:text-emerald-500 dark:group-hover:text-emerald-400' 
                  : 'group-hover:text-amber-500 dark:group-hover:text-amber-400';

            const activeBgClass = 
              categoryType === 'Admit Cards' 
                ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-500/10' 
                : categoryType === 'Results' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10' 
                  : 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-500/10';

            return (
              <Link
                key={job.id}
                href={getJobUrl(job.category, job.slug)}
                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Top Badge & Label Row */}
                  <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wide">
                    <span className="text-gray-400 truncate max-w-[150px]">
                      <TranslateText text={job.department} />
                    </span>
                    {categoryType === 'Jobs' ? (
                      <span
                        className={`px-2 py-0.5 rounded-[4px] shrink-0 font-extrabold uppercase tracking-wider ${
                          expired
                            ? 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-500/10'
                            : 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-500/10'
                        }`}
                      >
                        <TranslateText text={expired ? 'Expired' : 'Active'} />
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded-[4px] shrink-0 font-extrabold uppercase tracking-wider ${activeBgClass}`}
                      >
                        <TranslateText text={categoryType === 'Admit Cards' ? 'Released' : 'Declared'} />
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className={`font-extrabold text-sm text-gray-900 dark:text-white leading-snug transition-colors line-clamp-2 ${hoverTextClass}`}>
                    <TranslateText text={job.title} />
                  </h3>

                  {/* Overview excerpt */}
                  <p className="text-xs leading-relaxed text-gray-550 dark:text-gray-400 line-clamp-3">
                    <TranslateText text={job.overview ? job.overview.substring(0, 160) + '...' : ''} />
                  </p>

                  {/* Meta Tags (State badge, etc) */}
                  {job.state && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="bg-slate-150 dark:bg-slate-800/60 text-slate-655 dark:text-slate-350 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                        <TranslateText text={job.state} />
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Dates Info Block */}
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[var(--border-color)] text-[10px] text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {categoryType === 'Jobs' ? (
                      <span className={expired ? 'text-red-500 dark:text-red-400 font-semibold' : ''}>
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
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-sm text-gray-500 border border-dashed border-[var(--border-color)] rounded-2xl">
          <TranslateText text="No matches found for your search filters." />
        </div>
      )}
    </div>
  );
}
