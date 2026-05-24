import { getJobs } from '@/lib/db';
import DistrictJobFilter from '@/components/DistrictJobFilter';
import TranslateText from '@/components/TranslateText';

export const revalidate = 60;

export async function generateStaticParams() {
  const districts = ["patna", "kolkata", "lucknow", "mumbai", "jaipur", "bhopal"];
  return districts.map((dist) => ({
    district: dist
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const distName = resolvedParams.district.charAt(0).toUpperCase() + resolvedParams.district.slice(1);

  return {
    title: `${distName} District Govt Jobs | Latest Recruitment Updates`,
    description: `Find all latest local government jobs, municipal corporation recruitments, and district court vacancy announcements for ${distName}.`
  };
}

export default async function DistrictJobsPage({ params }) {
  const resolvedParams = await params;
  const distSlug = resolvedParams.district;
  const distName = distSlug.charAt(0).toUpperCase() + distSlug.slice(1);

  const jobs = await getJobs();
  
  // Filter jobs by matching normalized district name
  const filteredJobs = jobs.filter(
    (job) => job.district && job.district.toLowerCase() === distSlug
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--border-color)] pb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          <TranslateText text={distName} /> <TranslateText text="District Jobs" />
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          <TranslateText text="Latest localized recruitment updates, court openings, and block-level updates for" /> <TranslateText text={distName} />.
        </p>
      </div>

      <DistrictJobFilter jobs={filteredJobs} districtName={distName} />
    </div>
  );
}
