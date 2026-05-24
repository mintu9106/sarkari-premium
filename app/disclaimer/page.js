import TranslateText from '@/components/TranslateText';

export const metadata = {
  title: 'Disclaimer | Sarkari Premium',
  description: 'Legal disclaimer for job seekers using the Sarkari Premium portal.'
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      {/* Premium Hero Banner */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.1),transparent_50%)]"></div>
        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
            <TranslateText text="Legal Information" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white">
            <TranslateText text="Disclaimer" />
          </h1>
          <p className="text-slate-350 text-sm sm:text-base max-w-xl leading-relaxed">
            <TranslateText text="Please read our information warranty statements, legal boundaries, and official references policy." />
          </p>
        </div>
      </section>

      {/* Main Info Card */}
      <section className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 dark:text-white border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-red-500 rounded"></span>
          <TranslateText text="Warranty of Information" />
        </h2>
        
        <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            <TranslateText text="The information contained in this website is for general information purposes only. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose." />
          </p>
          <p>
            <TranslateText text="Any reliance you place on such information is therefore strictly at your own risk. In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website." />
          </p>
          <p>
            <TranslateText text="Through this website, you are able to link to other websites which are not under the control of Sarkari Premium. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them." />
          </p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-sm leading-relaxed text-amber-800 dark:text-amber-400 font-medium">
          ⚠️ <strong className="font-extrabold text-gray-950 dark:text-white uppercase text-xs tracking-wider block mb-1"><TranslateText text="Important Notice for Job Seekers" /></strong>
          <TranslateText text="Sarkari Premium is an independent informational portal and is NOT affiliated with any government department, commission, or organization. All job seekers are highly advised to cross-check recruitment announcements with official publications in the Employment News or on the official government department websites before applying." />
        </div>
      </section>
    </div>
  );
}
