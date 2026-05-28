import Link from 'next/link';
import { getJobs, getJobUrl } from '@/lib/db';

export const revalidate = 60;

export const metadata = {
  title: "Central Govt Jobs | Latest Central Recruitment Notifications",
  description: "Find all latest Central Government recruitment notifications, eligibility, timelines, and direct links for UPSC, SSC, Railways, Defense, and Banking jobs."
};

export default async function CentralJobsPage() {
  const jobs = await getJobs(true);
  const filteredJobs = jobs.filter(
    (job) => job.category === 'Central Govt Jobs'
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-color)] pb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Central Government Jobs</h1>
        <p className="text-xs text-gray-500 mt-1">Latest recruitment updates from UPSC, SSC, Railways, and central ministries.</p>
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm divide-y divide-[var(--border-color)]">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Link 
              key={job.id} 
              href={getJobUrl(job.category, job.slug)}
              className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all group"
            >
              <h2 className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                {job.title}
              </h2>
              <p className="text-xs text-gray-500 mt-1 max-w-3xl leading-relaxed">
                {job.overview.substring(0, 160)}...
              </p>
              <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-400">
                <span className="font-semibold text-gray-500">{job.department}</span>
                <span>•</span>
                <span>Apply Before: {job.important_dates?.end_date || 'N/A'}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">No active Central Govt job postings.</div>
        )}
      </div>
    </div>
  );
}
