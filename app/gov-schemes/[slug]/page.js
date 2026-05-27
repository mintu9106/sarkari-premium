import { notFound, redirect } from 'next/navigation';
import { getJobs, getJobBySlug } from '@/lib/db';
import TranslateText from '@/components/TranslateText';
import TranslateMarkdown from '@/components/TranslateMarkdown';
import { renderMarkdown } from '@/lib/markdown';
import JobShareButtons from '@/components/JobShareButtons';

export const revalidate = 60; // ISR validation rate

// Pre-render all gov schemes at build time
export async function generateStaticParams() {
  const jobs = await getJobs();
  const schemes = jobs.filter(job => job.category === 'Govt Schemes');
  return schemes.map((job) => ({
    slug: job.slug
  }));
}

// Generate metadata for the schemes
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);

  if (!job) {
    return {
      title: 'Scheme Not Found'
    };
  }

  const title = job.meta_title || `${job.title} Scheme: Eligibility, Benefits & How to Apply`;
  const description = job.meta_description || job.overview.substring(0, 155);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: job.updated_at
    }
  };
}

export default async function GovSchemePage({ params }) {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Cross-route redirects to enforce clean URL separation
  if (job.category !== 'Govt Schemes') {
    if (job.category === 'Admit Cards') {
      redirect(`/admit-cards/${job.slug}`);
    } else if (job.category === 'Results') {
      redirect(`/results/${job.slug}`);
    } else {
      redirect(`/jobs/${job.slug}`);
    }
  }

  // Schema.org GovernmentService JSON-LD for Google Search Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    "name": job.title,
    "serviceType": "Welfare Scheme",
    "description": job.overview,
    "provider": {
      "@type": "GovernmentOrganization",
      "name": job.department
    },
    "audience": {
      "@type": "Audience",
      "audienceType": job.eligibility
    }
  };

  const themeColors = {
    bg: job.state ? 'from-violet-600 to-violet-700' : 'from-indigo-600 to-indigo-700',
    text: job.state ? 'text-violet-500' : 'text-indigo-500',
    badge: job.state 
      ? 'bg-violet-100 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400' 
      : 'bg-indigo-100 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
  };

  return (
    <article className="space-y-8">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dynamic SEO Header Block (SVG Banner) */}
      <div className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-r ${themeColors.bg} text-white p-6 sm:p-10 shadow-lg`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.1),transparent)]"></div>
        <div className="relative max-w-4xl space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">
              <TranslateText text="Govt Scheme" />
            </span>
            <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded text-xs font-bold uppercase">
              {job.state ? <TranslateText text={job.state} /> : <TranslateText text="Central Government" />}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            <TranslateText text={job.title} />
          </h1>
          <div className="text-sm font-medium text-white/90">
            <TranslateText text={job.department} />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Scheme Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Scheme Overview */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className={`w-1.5 h-6 rounded ${job.state ? 'bg-violet-500' : 'bg-indigo-500'}`}></span>
              <TranslateText text="Scheme Overview" />
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <TranslateText text={job.overview} />
            </p>
          </section>

          {/* Eligibility Criteria */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className={`w-1.5 h-6 rounded ${job.state ? 'bg-violet-500' : 'bg-indigo-500'}`}></span>
              <TranslateText text="Eligibility Criteria" />
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
              <TranslateText text={job.eligibility} />
            </p>
          </section>

          {/* Age Limit & Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
              <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                <span className={`w-1.5 h-6 rounded ${job.state ? 'bg-violet-500' : 'bg-indigo-500'}`}></span>
                <TranslateText text="Age Limit" />
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-pre-line">
                <TranslateText text={job.age_limit} />
              </p>
            </section>

            <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
              <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                <span className={`w-1.5 h-6 rounded ${job.state ? 'bg-violet-500' : 'bg-indigo-500'}`}></span>
                <TranslateText text="Scheme Assistance & Benefits" />
              </h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-pre-line">
                <TranslateText text={job.salary} />
              </p>
            </section>
          </div>

          {/* How to Apply Guide */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className={`w-1.5 h-6 rounded ${job.state ? 'bg-violet-500' : 'bg-indigo-500'}`}></span>
              <TranslateText text="How to Apply" />
            </h2>
            <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg border border-[var(--border-color)]">
              <TranslateText text={job.how_to_apply} />
            </div>
          </section>

          {/* Detailed Info / Tables */}
          {job.content && (
            <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
              <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                <span className={`w-1.5 h-6 rounded ${job.state ? 'bg-violet-500' : 'bg-indigo-500'}`}></span>
                <TranslateText text="Detailed Welfare Benefits & Guidelines" />
              </h2>
              <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 markdown-content notranslate" translate="no">
                <TranslateMarkdown html={renderMarkdown(job.content)} />
              </div>
            </section>
          )}

        </div>

        {/* Right Column: Timelines & Quick Links */}
        <div className="space-y-8">
          
          {/* Timeline Dates */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b border-[var(--border-color)]">
              <TranslateText text="Important Timelines" />
            </h3>
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                <tr className="border-b border-[var(--border-color)]">
                  <td className="py-2.5 font-bold text-gray-500 dark:text-gray-400"><TranslateText text="Launch Date" /></td>
                  <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{job.important_dates?.start_date || 'N/A'}</td>
                </tr>
                {job.important_dates?.end_date && (
                  <tr>
                    <td className="py-2.5 font-bold text-gray-500 dark:text-gray-400"><TranslateText text="Application Last Date" /></td>
                    <td className="py-2.5 text-right font-semibold text-red-600 dark:text-red-400">{job.important_dates.end_date}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Quick Links */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b border-[var(--border-color)]">
              <TranslateText text="Official Scheme Links" />
            </h3>
            <div className="flex flex-col gap-3">
              {job.apply_link && (
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 px-4 text-white text-center font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm ${
                    job.state ? 'bg-violet-600 hover:bg-violet-700' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <TranslateText text="Apply Online Link" />
                </a>
              )}
              {job.official_pdf_link && (
                <a
                  href={job.official_pdf_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-center font-bold text-sm rounded-lg border border-[var(--border-color)] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <TranslateText text="Download Official PDF" />
                </a>
              )}
            </div>
          </section>

          {/* Share Buttons */}
          <JobShareButtons title={job.title} slug={job.slug} />

        </div>

      </div>
    </article>
  );
}
