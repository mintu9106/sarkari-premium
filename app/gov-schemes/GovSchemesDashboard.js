"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TranslateText from '@/components/TranslateText';

export default function GovSchemesDashboard({ initialSchemes = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, central, state
  const [selectedState, setSelectedState] = useState(""); // empty for all states
  const [filteredSchemes, setFilteredSchemes] = useState(initialSchemes);

  // Extract unique states available in the schemes list
  const uniqueStates = Array.from(
    new Set(initialSchemes.map(s => s.state).filter(Boolean))
  ).sort();

  useEffect(() => {
    let result = initialSchemes;

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.overview.toLowerCase().includes(q) ||
        (s.state && s.state.toLowerCase().includes(q))
      );
    }

    // 2. Tab Filter
    if (activeTab === "central") {
      result = result.filter(s => !s.state);
    } else if (activeTab === "state") {
      result = result.filter(s => !!s.state);
      
      // 3. State Dropdown Filter
      if (selectedState) {
        result = result.filter(s => s.state === selectedState);
      }
    }

    setFilteredSchemes(result);
  }, [searchQuery, activeTab, selectedState, initialSchemes]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Controls */}
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-xl self-start shrink-0">
          <button
            onClick={() => { setActiveTab("all"); setSelectedState(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === "all"
                ? "bg-indigo-600 text-white shadow-md scale-[1.02]"
                : "text-gray-600 dark:text-gray-400 hover:text-indigo-500"
            }`}
          >
            <TranslateText text="All Schemes" />
          </button>
          <button
            onClick={() => { setActiveTab("central"); setSelectedState(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === "central"
                ? "bg-indigo-600 text-white shadow-md scale-[1.02]"
                : "text-gray-600 dark:text-gray-400 hover:text-indigo-500"
            }`}
          >
            <TranslateText text="Central Schemes" />
          </button>
          <button
            onClick={() => setActiveTab("state")}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === "state"
                ? "bg-indigo-600 text-white shadow-md scale-[1.02]"
                : "text-gray-600 dark:text-gray-400 hover:text-indigo-500"
            }`}
          >
            <TranslateText text="State Schemes" />
          </button>
        </div>

        {/* Search input and State select */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-xl md:justify-end">
          {/* State selector (Visible only under State tab) */}
          {activeTab === "state" && (
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border border-[var(--border-color)] px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <option value=""><TranslateText text="All States" /></option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          )}

          {/* Search box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search schemes by name, benefit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-[var(--border-color)] pl-10 pr-4 py-2 rounded-xl text-xs font-semibold text-gray-800 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Grid of Schemes */}
      {filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map(scheme => (
            <article
              key={scheme.slug}
              className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Provider Label & Badge */}
                <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wide">
                  <span className="text-gray-400 truncate max-w-[180px]">
                    <TranslateText text={scheme.department} />
                  </span>
                  <span className={`px-2 py-0.5 rounded-[4px] shrink-0 ${
                    scheme.state
                      ? "bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400"
                      : "bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                  }`}>
                    {scheme.state ? <TranslateText text={scheme.state} /> : <TranslateText text="Central" />}
                  </span>
                </div>

                {/* Scheme Title */}
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white leading-snug group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                  <Link href={`/gov-schemes/${scheme.slug}`}>
                    <TranslateText text={scheme.title} />
                  </Link>
                </h3>

                {/* Overview excerpt */}
                <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-450 line-clamp-3">
                  <TranslateText text={scheme.overview} />
                </p>

                {/* Benefits tag */}
                <div className="bg-slate-50 dark:bg-slate-900/40 border border-[var(--border-color)] rounded-xl p-3 text-xs space-y-1">
                  <div className="text-[10px] text-gray-400 uppercase font-black tracking-wide">
                    <TranslateText text="Benefits & Assistance" />
                  </div>
                  <div className="font-bold text-gray-800 dark:text-gray-200">
                    <TranslateText text={scheme.salary} />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 border-t border-[var(--border-color)] mt-5">
                <Link
                  href={`/gov-schemes/${scheme.slug}`}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-center font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <TranslateText text="View Details" />
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-sm text-gray-500 border border-dashed border-[var(--border-color)] rounded-2xl">
          <TranslateText text="No government schemes found matching the criteria." />
        </div>
      )}
    </div>
  );
}
