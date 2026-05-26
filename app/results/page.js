import Link from 'next/link';
import { getJobs, getJobUrl } from '@/lib/db';

export const revalidate = 60;

export const metadata = {
  title: "Latest Results | Government Recruitment Exam Results",
  description: "Check latest government exam results, cut-off marks, and merit lists declared officially for Central and State recruitments."
};

export default async function ResultsPage() {
  const jobs = await getJobs();
  const filteredJobs = jobs.filter(
    (job) => job.category === 'Results'
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-color)] pb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Exam Results & Merit Lists</h1>
        <p className="text-xs text-gray-500 mt-1">Official merit lists, cut-off marks, and final results updates.</p>
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm divide-y divide-[var(--border-color)]">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Link 
              key={job.id} 
              href={getJobUrl(job.category, job.slug)}
              className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all group"
            >
              <h2 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                {job.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1 max-w-3xl leading-relaxed">
                {job.overview.substring(0, 160)}...
              </p>
              <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-400">
                <span className="font-semibold text-gray-500">{job.department}</span>
                <span>•</span>
                <span className="text-emerald-500 font-bold uppercase tracking-wider text-[9px] bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">Declared</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">No results declared recently.</div>
        )}
      </div>
    </div>
  );
}
