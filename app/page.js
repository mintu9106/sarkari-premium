import Link from 'next/link';
import { getJobs } from '@/lib/db';
import TranslateText from '@/components/TranslateText';

export const revalidate = 60; // Revalidate page every 60 seconds (ISR)

export default async function Home() {
  const jobs = await getJobs();

  // Categorize jobs
  const latestJobs = jobs.filter(
    (job) => 
      job.category === 'Central Govt Jobs' || 
      job.category === 'State-wise Jobs' || 
      job.category === 'District-wise Jobs'
  ).slice(0, 15);

  const admitCards = jobs.filter(
    (job) => job.category === 'Admit Cards'
  ).slice(0, 15);

  const results = jobs.filter(
    (job) => job.category === 'Results'
  ).slice(0, 15);

  return (
    <div className="space-y-12">
      {/* Hero / Quick Search Banner */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.1),transparent_50%)]"></div>
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <TranslateText text="Premium Gov Job Updates" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            <TranslateText text="Get the most accurate updates for government jobs without any hassle." />
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            <TranslateText text="Sarkari Premium fetches, parses, and cleans official government recruitment notifications into structured eligibility and apply guides." />
          </p>
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50 max-w-md">
            <div>
              <div className="text-2xl font-black text-amber-400">{latestJobs.length}+</div>
              <div className="text-xs text-slate-400">
                <TranslateText text="Active Jobs" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">{admitCards.length}+</div>
              <div className="text-xs text-slate-400">
                <TranslateText text="Admit Cards" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">{results.length}+</div>
              <div className="text-xs text-slate-400">
                <TranslateText text="Exams Results" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sarkari Result Three-Column Dashboard */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1: Latest Jobs */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md border border-[var(--border-color)] overflow-hidden transition-all hover:shadow-lg">
          <div className="bg-amber-500 text-black px-6 py-4 flex items-center justify-between">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <TranslateText text="Latest Jobs" />
            </h2>
            <span className="bg-black/10 text-xs px-2.5 py-0.5 rounded-full font-bold">
              <TranslateText text="Govt Jobs" />
            </span>
          </div>
          <div className="divide-y divide-[var(--border-color)] max-h-[600px] overflow-y-auto">
            {latestJobs.length > 0 ? (
              latestJobs.map((job) => (
                <Link 
                  key={job.id} 
                  href={`/jobs/${job.slug}`}
                  className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all group"
                >
                  <div className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                    <TranslateText text={job.title} />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="truncate max-w-[150px]"><TranslateText text={job.department} /></span>
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-medium text-gray-600 dark:text-gray-300">
                      <TranslateText text="Apply Before" />: {job.important_dates?.end_date || 'N/A'}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                <TranslateText text="No active job listings." />
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Admit Cards */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md border border-[var(--border-color)] overflow-hidden transition-all hover:shadow-lg">
          <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <TranslateText text="Admit Cards" />
            </h2>
            <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
              <TranslateText text="Hall Tickets" />
            </span>
          </div>
          <div className="divide-y divide-[var(--border-color)] max-h-[600px] overflow-y-auto">
            {admitCards.length > 0 ? (
              admitCards.map((job) => (
                <Link 
                  key={job.id} 
                  href={`/jobs/${job.slug}`}
                  className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all group"
                >
                  <div className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    <TranslateText text={job.title} />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="truncate max-w-[150px]"><TranslateText text={job.department} /></span>
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-medium">
                      <TranslateText text="Released" />
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                <TranslateText text="No active admit cards." />
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Results */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md border border-[var(--border-color)] overflow-hidden transition-all hover:shadow-lg">
          <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <TranslateText text="Latest Results" />
            </h2>
            <span className="bg-white/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
              <TranslateText text="Declared" />
            </span>
          </div>
          <div className="divide-y divide-[var(--border-color)] max-h-[600px] overflow-y-auto">
            {results.length > 0 ? (
              results.map((job) => (
                <Link 
                  key={job.id} 
                  href={`/jobs/${job.slug}`}
                  className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all group"
                >
                  <div className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                    <TranslateText text={job.title} />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="truncate max-w-[150px]"><TranslateText text={job.department} /></span>
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-medium">
                      <TranslateText text="Declared" />
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                <TranslateText text="No results declared recently." />
              </div>
            )}
          </div>
        </div>

      </section>

      {/* State-wise Quick Grid */}
      <section className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border-color)] space-y-4">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white">
          <TranslateText text="State PCS & Jobs Updates" />
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {["Uttar Pradesh", "West Bengal", "Bihar", "Delhi", "Maharashtra", "Rajasthan", "Madhya Pradesh"].map((state) => (
            <Link 
              key={state}
              href={`/state-jobs/${state.toLowerCase().replace(' ', '-')}`}
              className="py-2.5 px-4 bg-gray-50 hover:bg-amber-50 dark:bg-gray-800 dark:hover:bg-amber-950/10 text-center rounded-lg border border-[var(--border-color)] font-semibold text-xs text-gray-700 dark:text-gray-300 hover:text-amber-500 transition-all"
            >
              <TranslateText text={state} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
