import { getJobs } from '@/lib/db';
import JobListing from '@/components/JobListing';

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
    <JobListing
      initialJobs={filteredJobs}
      categoryType="Results"
      title="Exam Results & Merit Lists"
      subtitle="Find official merit lists, cut-off marks, and declared results updates."
    />
  );
}

