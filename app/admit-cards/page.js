import Link from 'next/link';
import { getJobs } from '@/lib/db';

export const revalidate = 60;

export const metadata = {
  title: "Admit Cards | Latest Government Exam Hall Tickets",
  description: "Download latest government recruitment exam admit cards and view hall tickets update schedules for UPSC, SSC, Railways, State PCS, and other exams."
};

export default async function AdmitCardsPage() {
  const jobs = await getJobs();
  const filteredJobs = jobs.filter(
    (job) => job.category === 'Admit Cards'
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-color)] pb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Admit Cards & Hall Tickets</h1>
        <p className="text-xs text-gray-500 mt-1">Download links and dates for active government recruitment exams.</p>
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm divide-y divide-[var(--border-color)]">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Link 
              key={job.id} 
              href={`/jobs/${job.slug}`}
              className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all group"
            >
              <h2 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                {job.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1 max-w-3xl leading-relaxed">
                {job.overview.substring(0, 160)}...
              </p>
              <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-400">
                <span className="font-semibold text-gray-500">{job.department}</span>
                <span>•</span>
                <span className="text-blue-500 font-bold uppercase tracking-wider text-[9px] bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded">Active Link</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">No active admit card notices.</div>
        )}
      </div>
    </div>
  );
}
