import { notFound, redirect } from 'next/navigation';
import { getJobs, getJobBySlug } from '@/lib/db';
import TranslateText from '@/components/TranslateText';
import TranslateMarkdown from '@/components/TranslateMarkdown';
import { renderMarkdown, stripSections } from '@/lib/markdown';
import JobShareButtons from '@/components/JobShareButtons';

export const revalidate = 60; // ISR validation rate

// SSG: Pre-render all result slugs at build time
export async function generateStaticParams() {
  const jobs = await getJobs();
  const results = jobs.filter(job => job.category === 'Results');
  return results.map((job) => ({
    slug: job.slug
  }));
}

// SEO: Generate dynamic metadata for search engines
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);
  
  if (!job) {
    return {
      title: 'Result Not Found'
    };
  }

  const title = job.meta_title || `${job.title} Result: Merit List, Cut-Off Marks`;
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

export default async function ResultPage({ params }) {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  // Cross-route redirects to enforce clean SEO links
  if (job.category !== 'Results') {
    if (job.category === 'Admit Cards') {
      redirect(`/admit-cards/${job.slug}`);
    } else {
      redirect(`/jobs/${job.slug}`);
    }
  }

  // Schema.org NewsArticle JSON-LD for Google Search Rich Snippets
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

  const themeColors = { bg: 'from-emerald-600 to-emerald-700', text: 'text-emerald-500', badge: 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' };

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
        
        {/* Left Column: Result Overview & Check Result Steps */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Result Overview */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded"></span>
              <TranslateText text="Result Overview" />
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <TranslateText text={job.overview} />
            </p>
          </section>

          

          {/* Detailed Vacancy & Tables */}
          {job.content && (
            <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
              <h2 className="text-lg font-black border-b border-[var(--border-color)] pb-2 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded"></span>
                <TranslateText text="Detailed Merit Lists & Cut-Off Marks" />
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
                <tr>
                  <td className="py-2.5 font-bold text-gray-500 dark:text-gray-400"><TranslateText text="Result Declaration Date" /></td>
                  <td className="py-2.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">{job.important_dates?.start_date || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Quick Links & Resources */}
          <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b border-[var(--border-color)]">
              <TranslateText text="Verification Links" />
            </h3>
            <div className="flex flex-col gap-3">
              {job.apply_link && (
                <a
                  href={job.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <TranslateText text="Check Result Link" />
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
                  <TranslateText text="Download Results Sheet PDF" />
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
