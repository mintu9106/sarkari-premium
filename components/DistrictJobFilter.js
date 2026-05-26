"use client";

import { useState } from 'react';
import Link from 'next/link';
import TranslateText from './TranslateText';

export default function DistrictJobFilter({ jobs = [], districtName = "" }) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Extract unique blocks and municipalities
  const blocks = [...new Set(jobs.map(j => j.block).filter(Boolean))];
  const municipalities = [...new Set(jobs.map(j => j.municipality).filter(Boolean))];

  // Filter jobs based on selection
  const filteredJobs = jobs.filter(job => {
    if (selectedFilter === "all") return true;
    if (selectedFilter.startsWith("block:")) {
      const blockVal = selectedFilter.replace("block:", "");
      return job.block === blockVal;
    }
    if (selectedFilter.startsWith("municipality:")) {
      const muniVal = selectedFilter.replace("municipality:", "");
      return job.municipality === muniVal;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Pills Container */}
      {(blocks.length > 0 || municipalities.length > 0) && (
        <div className="flex flex-wrap gap-2 pb-2 border-b border-[var(--border-color)]">
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === "all"
                ? "bg-amber-500 text-black shadow-sm"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            <TranslateText text="All Areas" /> ({jobs.length})
          </button>
          
          {blocks.map(block => (
            <button
              key={block}
              onClick={() => setSelectedFilter(`block:${block}`)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === `block:${block}`
                  ? "bg-amber-500 text-black shadow-sm"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              🏢 <TranslateText text="Block" />: <TranslateText text={block} />
            </button>
          ))}

          {municipalities.map(muni => (
            <button
              key={muni}
              onClick={() => setSelectedFilter(`municipality:${muni}`)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === `municipality:${muni}`
                  ? "bg-amber-500 text-black shadow-sm"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              🏛️ <TranslateText text="Municipality" />: <TranslateText text={muni} />
            </button>
          ))}
        </div>
      )}

      {/* Jobs list */}
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm divide-y divide-[var(--border-color)]">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Link 
              key={job.id} 
              href={
                job.category === 'Admit Cards' 
                  ? `/admit-cards/${job.slug}` 
                  : job.category === 'Results' 
                    ? `/results/${job.slug}` 
                    : `/jobs/${job.slug}`
              }
              className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                    <TranslateText text={job.title} />
                  </h2>
                  <p className="text-xs text-gray-500 max-w-3xl leading-relaxed">
                    <TranslateText text={job.overview.substring(0, 160)} />...
                  </p>
                </div>
                {/* Specific Location Badges */}
                <div className="flex flex-wrap gap-1.5 self-start shrink-0">
                  {job.block && (
                    <span className="text-[10px] bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-bold border border-amber-200/30">
                      <TranslateText text="Block" />: <TranslateText text={job.block} />
                    </span>
                  )}
                  {job.municipality && (
                    <span className="text-[10px] bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded font-bold border border-purple-200/30">
                      <TranslateText text="Municipality" />: <TranslateText text={job.municipality} />
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-400">
                <span className="font-semibold text-gray-500"><TranslateText text={job.department} /></span>
                <span>•</span>
                <span><TranslateText text="Apply Before" />: {job.important_dates?.end_date || 'N/A'}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">
            <TranslateText text="No active job postings match this area currently." />
          </div>
        )}
      </div>
    </div>
  );
}
