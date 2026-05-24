import TranslateText from '@/components/TranslateText';

export const metadata = {
  title: 'Contact Us | Sarkari Premium',
  description: 'Reach out to Sarkari Premium team for corrections, feedback, or support.'
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="border-b border-[var(--border-color)] pb-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          <TranslateText text="Contact Us" />
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          <TranslateText text="Have feedback or found a correction? Reach out to us below." />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Contact info card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-6 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white">
              <TranslateText text="General Inquiries" />
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <TranslateText text="For general inquiries, media partnerships, or feedback on our translation engine, please email us directly or fill the support form." />
            </p>
            <div className="text-xs space-y-1.5 pt-2 border-t border-[var(--border-color)]">
              <div className="font-bold text-gray-800 dark:text-gray-200">Email:</div>
              <div className="text-amber-500">support@sarkaripremium.com</div>
            </div>
          </div>
        </div>

        {/* Form container */}
        <div className="md:col-span-3">
          <form className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-6 space-y-4 shadow-sm">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                <TranslateText text="Full Name" />
              </label>
              <input
                type="text"
                id="contact-name"
                required
                className="w-full px-3.5 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                <TranslateText text="Email Address" />
              </label>
              <input
                type="email"
                id="contact-email"
                required
                className="w-full px-3.5 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div>
              <label htmlFor="contact-msg" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                <TranslateText text="Message" />
              </label>
              <textarea
                id="contact-msg"
                rows="4"
                required
                className="w-full px-3.5 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-black text-center font-bold text-sm rounded-lg transition-colors cursor-pointer"
            >
              <TranslateText text="Send Message" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
