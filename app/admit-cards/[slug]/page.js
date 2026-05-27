import { notFound, redirect } from 'next/navigation';
import { getJobs, getJobBySlug } from '@/lib/db';
import TranslateText from '@/components/TranslateText';
import TranslateMarkdown from '@/components/TranslateMarkdown';
import { renderMarkdown, stripSections } from '@/lib/markdown';
import JobShareButtons from '@/components/JobShareButtons';

export const revalidate = 60; // ISR validation rate

// SSG: Pre-render all admit card slugs at build time
export async function generateStaticParams() {
  const jobs = await getJobs();
  const admitCards = jobs.filter(job => job.category === 'Admit Cards');
  return admitCards.map((job) => ({
    slug: job.slug
  }));
}

// SEO: Generate dynamic metadata for search engines
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);
  
  if (!job) {
    return {
      title: 'Admit Card Not Found'
    };
  }

  const title = job.meta_title || `${job.title} Admit Card: Download Link, Exam Dates`;
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

export default async function AdmitCardPage({ params }) {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Cross-route redirects to enforce clean SEO links
  if (job.category !== 'Admit Cards') {
    if (job.category === 'Results') {
      redirect(`/results/${job.slug}`);
    } else {
      redirect(`/jobs/${job.slug}`);
    }
  }

  // Schema.org NewsArticle JSON-LD for Google Search Rich Snippets (Better than JobPosting for admit cards)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": job.title,
    "description": job.overview,
    "datePublished": job.updated_at,
    "dateModified": job.updated_at,
    "author": {
      "@type": "Organization",
      "name": "Sarkari Premium",
      "url": "https://sarkari-premium.vercel.app"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sarkari Premium",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sarkari-premium.vercel.app/logo.png"
      }
    }
  };

  const themeColors = { bg: 'from-blue-600 to-blue-700', text: 'text-blue-500', badge: 'bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400' };

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
        
        {/* Left Column: Admit Card Overview & Download Steps */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Admit Card Overview */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded"></span>
              <TranslateText text="Admit Card Overview" />
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <TranslateText text={job.overview} />
            </p>
          </section>

          {/* Detailed Vacancy & Tables */}
          {job.content && (
            <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
              <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded"></span>
                <TranslateText text="Detailed Examination Schedules & Info" />
              </h2>
              <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 markdown-content notranslate" translate="no">
                <TranslateMarkdown 
                  html={renderMarkdown(
                    stripSections(job.content, ['fee', 'age', 'apply', 'eligibility', 'qualification', 'salary', 'pay'])
                  )} 
                />
              </div>
            </section>
          )}

        </div>

        {/* Right Column: Timelines, Quick Links, & Info Panel */}
        <div className="space-y-8">
          
          {/* Important Dates */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b border-[var(--border-color)]">
              <TranslateText text="Important Dates" />
            </h3>
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                <tr className="border-b border-[var(--border-color)]">
                  <td className="py-2.5 font-bold text-gray-500 dark:text-gray-400"><TranslateText text="Admit Card Release Date" /></td>
                  <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{job.important_dates?.start_date || 'N/A'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-gray-500 dark:text-gray-400"><TranslateText text="Exam Date" /></td>
                  <td className="py-2.5 text-right font-semibold text-gray-900 dark:text-white">{job.important_dates?.exam_date || 'TBA'}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Quick Links & Resources */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b border-[var(--border-color)]">
              <TranslateText text="Download Links" />
            </h3>
            <div className="flex flex-col gap-3">
              {job.apply_link && (
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <TranslateText text="Download Admit Card Link" />
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
                  <TranslateText text="Download Official Notification PDF" />
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
