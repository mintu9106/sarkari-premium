import { getJobs } from '@/lib/db';
import JobListing from '@/components/JobListing';

export const revalidate = 60; // Revalidate page every 60 seconds (ISR)

export const metadata = {
  title: "Government Jobs | Central, State & District-wise Vacancies",
  description: "Browse all active and latest government job notifications, vacancies, eligibility details, and application forms for central, state, and district-level posts."
};

export default async function JobsPage() {
  const allJobs = await getJobs();
  
  // Filter only Job categories
  const jobsOnly = allJobs.filter(
    (job) => 
      job.category === 'Central Govt Jobs' || 
      job.category === 'State-wise Jobs' || 
      job.category === 'District-wise Jobs'
  );

  return (
    <JobListing
      initialJobs={jobsOnly}
      categoryType="Jobs"
      title="Government Recruitments & Jobs"
      subtitle="Find active and past government job notifications, qualifications, and direct apply portals."
    />
  );
}
