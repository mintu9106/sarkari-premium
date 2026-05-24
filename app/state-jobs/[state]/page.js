import Link from 'next/link';
import { getJobs } from '@/lib/db';

export const revalidate = 60;

export async function generateStaticParams() {
  // Pre-render pages for key states
  const states = ["uttar-pradesh", "west-bengal", "bihar", "delhi", "maharashtra", "madhya-pradesh", "rajasthan"];
  return states.map((state) => ({
    state: state
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const stateName = resolvedParams.state
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${stateName} Govt Jobs | Latest Recruitment Updates`,
    description: `Find all latest ${stateName} State government job notifications, PCS exams, local recruitment schedules, eligibility criteria, and application links.`
  };
}

export default async function StateJobsPage({ params }) {
  const resolvedParams = await params;
  const stateSlug = resolvedParams.state;
  const stateName = stateSlug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const jobs = await getJobs();
  
  // Filter jobs by matching normalized state name
  const filteredJobs = jobs.filter(
    (job) => job.state && job.state.toLowerCase().replace(' ', '-') === stateSlug
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-color)] pb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{stateName} Govt Jobs</h1>
        <p className="text-xs text-gray-500 mt-1">Latest state government and local board notifications for {stateName}.</p>
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm divide-y divide-[var(--border-color)]">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Link 
              key={job.id} 
              href={`/jobs/${job.slug}`}
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
          <div className="p-8 text-center text-sm text-gray-500">No active job listings for {stateName} currently.</div>
        )}
      </div>
    </div>
  );
}
