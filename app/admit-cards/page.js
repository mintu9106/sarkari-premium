import { getJobs } from '@/lib/db';
import JobListing from '@/components/JobListing';

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
    <JobListing
      initialJobs={filteredJobs}
      categoryType="Admit Cards"
      title="Admit Cards & Hall Tickets"
      subtitle="Find download links and status updates for active and past government exam admit cards."
    />
  );
}

