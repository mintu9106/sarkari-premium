import { getJobs } from '@/lib/db';
import JobListing from '@/components/JobListing';

export const revalidate = 60;

export const metadata = {
  title: "Central Govt Jobs | Latest Central Recruitment Notifications",
  description: "Find all latest Central Government recruitment notifications, eligibility, timelines, and direct links for UPSC, SSC, Railways, Defense, and Banking jobs."
};

export default async function CentralJobsPage() {
  const jobs = await getJobs();
  const filteredJobs = jobs.filter(
    (job) => job.category === 'Central Govt Jobs'
  );

  return (
    <JobListing
      initialJobs={filteredJobs}
      categoryType="Jobs"
      title="Central Government Jobs"
      subtitle="Browse latest recruitment updates from UPSC, SSC, Railways, and central ministries."
    />
  );
}

