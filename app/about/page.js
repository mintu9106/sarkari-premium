import TranslateText from '@/components/TranslateText';

export const metadata = {
  title: 'About Us | Sarkari Premium',
  description: 'Learn more about Sarkari Premium, India\'s premium ad-free government jobs notification portal.'
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      {/* Premium Hero Banner */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)]"></div>
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <TranslateText text="Who We Are" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white">
            <TranslateText text="About Us" />
          </h1>
          <p className="text-slate-350 text-sm sm:text-base max-w-xl leading-relaxed">
            <TranslateText text="Sarkari Premium is India's premium job portal providing instant, human-written, and well-structured government job notifications, admit cards, and results. We aim to simplify your career search with zero clutter." />
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Core Value Card 1 */}
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-lg font-bold">
            🚫
          </div>
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
            <TranslateText text="Ad-Free Experience" />
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            <TranslateText text="We eliminate all intrusive popup advertisements and spam redirections, letting you focus entirely on your exam preparation." />
          </p>
        </div>

        {/* Core Value Card 2 */}
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 text-lg font-bold">
            🤖
          </div>
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
            <TranslateText text="AI-Assisted Curation" />
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            <TranslateText text="Our technology gathers job alerts directly from official departments, and compiles them into highly structured tables." />
          </p>
        </div>

        {/* Core Value Card 3 */}
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-lg font-bold">
            ⚡
          </div>
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
            <TranslateText text="Core Web Speed" />
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            <TranslateText text="Engineered on Next.js edge architecture to load instantaneously, even on restricted local block mobile data networks." />
          </p>
        </div>
      </div>

      {/* Comprehensive Mission */}
      <section className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 dark:text-white border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-amber-500 rounded"></span>
          <TranslateText text="Our Vision and Purpose" />
        </h2>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <TranslateText text="Traditionally, searching for Sarkari Result notifications involved navigating websites cluttered with flashing ads, dead links, and confusing layouts. Sarkari Premium was designed by full-stack engineers and SEO experts to set a new standard for job portals. We structure every job listing, recruit syllabus, admit card issue, and declared result table into a readable format, accompanied by simple, step-by-step guides written in a helpful human tone." />
        </p>
      </section>
    </div>
  );
}
