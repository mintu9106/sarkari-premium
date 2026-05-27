import { notFound, redirect } from 'next/navigation';
import { getJobs, getJobBySlug } from '@/lib/db';
import TranslateText from '@/components/TranslateText';
import TranslateMarkdown from '@/components/TranslateMarkdown';
import { renderMarkdown } from '@/lib/markdown';
import JobShareButtons from '@/components/JobShareButtons';

export const revalidate = 60; // ISR validation rate

// SSG: Pre-render all job slugs at build time
export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((job) => ({
    slug: job.slug
  }));
}

// SEO: Generate dynamic metadata for search engines
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);
  
  if (!job) {
    return {
      title: 'Job Not Found'
    };
  }

  // If page needs redirection, don't worry, Next.js handles it, but return meta
  return {
    title: job.meta_title || job.title,
    description: job.meta_description || job.overview.substring(0, 155),
    openGraph: {
      title: job.meta_title || job.title,
      description: job.meta_description || job.overview.substring(0, 155),
      type: 'article',
      publishedTime: job.updated_at
    }
  };
}

const renderTextOrList = (val) => {
  if (!val) return 'N/A';
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) {
    return val.map((item) => {
      if (typeof item === 'string') return item;
      if (typeof item === 'object') {
        const title = item.qualifier || item.title || '';
        const desc = item.description || item.desc || '';
        return `${title ? `${title}: ` : ''}${desc}`;
      }
      return '';
    }).filter(Boolean).join('\n');
  }
  return JSON.stringify(val);
};

export default async function JobPage({ params }) {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Cross-route redirects to enforce clean SEO links
  if (job.category === 'Admit Cards') {
    redirect(`/admit-cards/${job.slug}`);
  }
  if (job.category === 'Results') {
    redirect(`/results/${job.slug}`);
  }
  if (job.category === 'Govt Schemes') {
    redirect(`/gov-schemes/${job.slug}`);
  }

  const isJob = true; // For /jobs/[slug], it is always a Job now due to redirects above

  // Schema.org JobPosting JSON-LD for Google Search Job Cards
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.overview + "\n\nEligibility:\n" + renderTextOrList(job.eligibility) + "\n\nAge Limit:\n" + renderTextOrList(job.age_limit),
    "datePosted": job.updated_at,
    "validThrough": job.important_dates?.end_date ? `${job.important_dates.end_date}T23:59:59Z` : undefined,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.department,
      "logo": "https://sarkari-premium.vercel.app/logo.png"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.district || "Multiple",
        "addressRegion": job.state || "India",
        "addressCountry": "IN"
      }
    },
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": renderTextOrList(job.salary),
        "unitText": "MONTH"
      }
    }
  };

  // Color schemes based on category
  const themeColors = {
    'Central Govt Jobs': { bg: 'from-amber-600 to-amber-700', text: 'text-amber-500', badge: 'bg-amber-100 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400' },
    'State-wise Jobs': { bg: 'from-orange-600 to-orange-700', text: 'text-orange-500', badge: 'bg-orange-100 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400' },
    'District-wise Jobs': { bg: 'from-purple-600 to-purple-700', text: 'text-purple-500', badge: 'bg-purple-100 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400' },
    'Admit Cards': { bg: 'from-blue-600 to-blue-700', text: 'text-blue-500', badge: 'bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400' },
    'Results': { bg: 'from-emerald-600 to-emerald-700', text: 'text-emerald-500', badge: 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' }
  }[job.category] || { bg: 'from-slate-600 to-slate-700', text: 'text-slate-500', badge: 'bg-slate-100 dark:bg-slate-950/20 text-slate-600 dark:text-slate-400' };

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
              <TranslateText text={job.category} />
            </span>
            {job.state && (
              <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded text-xs font-bold uppercase">
                <TranslateText text={job.state} />
              </span>
            )}
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
        
        {/* Left Column: Job Description & Eligibility Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Job Overview */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-500 rounded"></span>
              <TranslateText text="Job Overview" />
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <TranslateText text={job.overview} />
            </p>
          </section>

          {/* Eligibility Criteria (Only for Jobs) */}
          {isJob && (
            <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
              <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-500 rounded"></span>
                <TranslateText text="Eligibility & Qualification" />
              </h2>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
                <TranslateText text={renderTextOrList(job.eligibility)} />
              </p>
            </section>
          )}

          {/* Age Limit & Salary (Only for Jobs) */}
          {isJob && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
                <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-amber-500 rounded"></span>
                  <TranslateText text="Age Limit" />
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-pre-line">
                  <TranslateText text={renderTextOrList(job.age_limit)} />
                </p>
              </section>

              <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
                <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-amber-500 rounded"></span>
                  <TranslateText text="Salary & Pay Scale" />
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-pre-line">
                  <TranslateText text={renderTextOrList(job.salary)} />
                </p>
              </section>
            </div>
          )}

          {/* How to Apply Guide */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-amber-500 rounded"></span>
              <TranslateText text="How to Apply" />
            </h2>
            <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg border border-[var(--border-color)]">
              <TranslateText text={renderTextOrList(job.how_to_apply)} />
            </div>
          </section>

          {/* Detailed Vacancy & Tables */}
          {job.content && (
            <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
              <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-amber-500 rounded"></span>
                <TranslateText text="Detailed Notification Tables & Info" />
              </h2>
              <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 markdown-content notranslate" translate="no">
                <TranslateMarkdown html={renderMarkdown(job.content)} />
              </div>
            </section>
          )}

        </div>

        {/* Right Column: Timelines, Quick Links, & Info Panel */}
        <div className="space-y-8">
          
          {/* Important Dates & Deadlines */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b border-[var(--border-color)]">
              <TranslateText text="Important Dates" />
            </h3>
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                {isJob ? (
                  <>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2.5 font-bold text-gray-500 dark:text-gray-400"><TranslateText text="Apply Start Date" /></td>
                      <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{job.important_dates?.start_date || 'N/A'}</td>
                    </tr>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2.5 font-bold text-gray-500 dark:text-gray-400"><TranslateText text="Last Date to Apply" /></td>
                      <td className="py-2.5 text-right font-semibold text-red-600 dark:text-red-400">{job.important_dates?.end_date || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-gray-500 dark:text-gray-400"><TranslateText text="Exam Date" /></td>
                      <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{job.important_dates?.exam_date || 'TBA'}</td>
                    </tr>
                  </>
                ) : job.category === 'Admit Cards' ? (
                  <>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2.5 font-bold text-gray-500 dark:text-gray-400"><TranslateText text="Admit Card Release Date" /></td>
                      <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{job.important_dates?.start_date || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-gray-500 dark:text-gray-400"><TranslateText text="Exam Date" /></td>
                      <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{job.important_dates?.exam_date || 'TBA'}</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="border-b border-[var(--border-color)]">
                      <td className="py-2.5 font-bold text-gray-500 dark:text-gray-400"><TranslateText text="Result Declaration Date" /></td>
                      <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{job.important_dates?.start_date || 'N/A'}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </section>

          {/* Quick Links & Resources */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b border-[var(--border-color)]">
              <TranslateText text="Application Links" />
            </h3>
            <div className="flex flex-col gap-3">
              {job.apply_link && (
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-black text-center font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <TranslateText 
                    text={
                      job.category === 'Admit Cards' 
                        ? "Download Admit Card Link" 
                        : job.category === 'Results' 
                          ? "Check Result Link" 
                          : "Apply Online Link"
                    } 
                  />
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
