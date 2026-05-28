import Link from 'next/link';
import { getJobs, getJobUrl } from '@/lib/db';
import TranslateText from '@/components/TranslateText';

export const revalidate = 60; // Revalidate page every 60 seconds (ISR)

export default async function Home() {
  const jobs = await getJobs(true);

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

  // Extract and format upcoming important dates for timeline calendar tracker
  const timelineEvents = [];
  jobs.forEach(job => {
    // Skip Govt Schemes — calendar tracker is only for Jobs, Admit Cards & Results
    if (job.category === 'Govt Schemes') return;
    if (job.important_dates) {
      const dates = job.important_dates;
      // Event: Application Starts
      if (dates.start_date && job.category !== 'Admit Cards' && job.category !== 'Results') {
        timelineEvents.push({
          jobTitle: job.title,
          category: job.category,
          slug: job.slug,
          eventName: "Application Starts",
          dateStr: dates.start_date,
          type: "start"
        });
      }
      // Event: Last Date to Apply
      if (dates.end_date && job.category !== 'Admit Cards' && job.category !== 'Results') {
        timelineEvents.push({
          jobTitle: job.title,
          category: job.category,
          slug: job.slug,
          eventName: "Last Date to Apply",
          dateStr: dates.end_date,
          type: "end"
        });
      }
      // Event: Admit Card Release
      if (dates.start_date && job.category === 'Admit Cards') {
        timelineEvents.push({
          jobTitle: job.title,
          category: job.category,
          slug: job.slug,
          eventName: "Admit Card Release",
          dateStr: dates.start_date,
          type: "admit"
        });
      }
      // Event: Result Declared
      if (dates.start_date && job.category === 'Results') {
        timelineEvents.push({
          jobTitle: job.title,
          category: job.category,
          slug: job.slug,
          eventName: "Result Declared",
          dateStr: dates.start_date,
          type: "result"
        });
      }
      // Event: Exam Date
      if (dates.exam_date) {
        timelineEvents.push({
          jobTitle: job.title,
          category: job.category,
          slug: job.slug,
          eventName: "Exam Date",
          dateStr: dates.exam_date,
          type: "exam"
        });
      }
    }
  });

  // Sort dates chronologically closest to today (excluding dates older than 3 months)
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const cutoffDateStr = threeMonthsAgo.toISOString().split('T')[0];

  const sortedEvents = timelineEvents
    .filter(e => e.dateStr && e.dateStr >= cutoffDateStr)
    .sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr))
    .slice(0, 8); // Top 8 events

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.toLocaleString('en-US', { month: 'short' });
      return { day, month, year: date.getFullYear() };
    } catch (e) {
      return { day: '?', month: '?', year: '' };
    }
  };

  const getDaysRemainingText = (dateStr) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(dateStr);
    target.setHours(0,0,0,0);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays > 1) return `In ${diffDays} days`;
    return "Ended";
  };

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

      {/* Exam Calendar & Important Dates Timeline Tracker */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-red-500 rounded"></span>
            <TranslateText text="Important Dates & Exam Calendar Tracker" />
          </h2>
          <span className="text-[10px] bg-red-100 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <TranslateText text="Live Schedule" />
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 select-none">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((evt, idx) => {
              const dateInfo = formatDate(evt.dateStr);
              const daysText = getDaysRemainingText(evt.dateStr);
              const isPast = daysText === "Ended";
              
              const typeConfig = {
                start: { bg: 'bg-amber-500', badge: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400' },
                end: { bg: 'bg-red-500', badge: 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400' },
                admit: { bg: 'bg-blue-500', badge: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400' },
                result: { bg: 'bg-emerald-500', badge: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450' },
                exam: { bg: 'bg-purple-500', badge: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400' }
              }[evt.type] || { bg: 'bg-gray-500', badge: 'bg-gray-50 dark:bg-gray-850 text-gray-600' };

              return (
                <div 
                  key={idx}
                  className="flex-shrink-0 w-72 bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-gray-300 dark:hover:border-gray-700 rounded-xl p-4 flex gap-4 transition-all duration-300 shadow-sm hover:shadow"
                >
                  {/* Calendar Sheet Icon */}
                  <div className="flex-shrink-0 w-14 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col text-center">
                    <div className={`${typeConfig.bg} text-white text-[9px] py-0.5 font-bold uppercase tracking-wider`}>
                      {dateInfo.month}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 flex-1 flex items-center justify-center font-black text-xl text-gray-800 dark:text-gray-200">
                      {dateInfo.day}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-[3px] uppercase tracking-wider ${typeConfig.badge}`}>
                          <TranslateText text={evt.eventName} />
                        </span>
                        <span className={`text-[8px] font-extrabold ${isPast ? 'text-gray-400' : 'text-emerald-500'}`}>
                          <TranslateText text={daysText} />
                        </span>
                      </div>
                      <Link 
                        href={getJobUrl(evt.category, evt.slug)}
                        className="block mt-1.5 font-bold text-xs text-gray-900 dark:text-white hover:text-amber-500 transition-colors line-clamp-2"
                      >
                        <TranslateText text={evt.jobTitle} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full text-center py-6 text-sm text-gray-500">
              <TranslateText text="No upcoming schedule events." />
            </div>
          )}
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
                  href={getJobUrl(job.category, job.slug)}
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
                  href={getJobUrl(job.category, job.slug)}
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
                  href={getJobUrl(job.category, job.slug)}
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
