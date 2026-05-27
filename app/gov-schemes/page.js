import { getJobs } from '@/lib/db';
import TranslateText from '@/components/TranslateText';
import GovSchemesDashboard from './GovSchemesDashboard';

export const revalidate = 60; // Revalidate page every 60 seconds

export const metadata = {
  title: "Government Schemes & Welfare Services (सरकारी योजनाएं)",
  description: "Explore ongoing central and state-level government schemes in India. Learn about eligibility criteria, financial benefits, coverages, and online application guides."
};

export default async function GovSchemesPage() {
  let schemes = [];
  try {
    const jobs = await getJobs();
    schemes = jobs.filter(job => job.category === 'Govt Schemes');
  } catch (e) {
    console.error("Failed to fetch government schemes:", e);
  }

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-indigo-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)]"></div>
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            🌐 <TranslateText text="Welfare Programs & Schemes" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            <TranslateText text="Government Schemes & Welfare Services" />
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            <TranslateText text="Track central and state-level government schemes, financial aids, medical coverages, scholarships, and farming subsidies in one place." />
          </p>
        </div>
      </section>

      {/* Interactive Schemes Dashboard */}
      <GovSchemesDashboard initialSchemes={schemes} />
    </div>
  );
}
