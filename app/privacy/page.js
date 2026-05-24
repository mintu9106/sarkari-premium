import TranslateText from '@/components/TranslateText';

export const metadata = {
  title: 'Privacy Policy | Sarkari Premium',
  description: 'Privacy policy and user data storage standards of Sarkari Premium.'
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="border-b border-[var(--border-color)] pb-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          <TranslateText text="Privacy Policy" />
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          <TranslateText text="Learn how we protect and handle your information on this portal." />
        </p>
      </div>

      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white"><TranslateText text="1. Information Collection" /></h2>
          <p><TranslateText text="We do not require users to create accounts to read job notifications. We do not collect personal identifiers, except for standard anonymous site analytics (like page views, region, and browser type) to improve platform responsiveness and load times." /></p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white"><TranslateText text="2. Cookies and Preferences" /></h2>
          <p><TranslateText text="We use local storage (on your device) to persist preferences such as your chosen theme (Light/Dark mode) and preferred language (English, Hindi, Bengali). These preferences are stored entirely in your browser and never sent to our servers." /></p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white"><TranslateText text="3. External Links" /></h2>
          <p><TranslateText text="Our job listings contain links to external government web services (e.g. ssc.gov.in, upsc.gov.in). Once you click those links, you leave our platform, and our privacy policy no longer applies. Please review the privacy terms of the official portals you visit." /></p>
        </div>
      </div>
    </div>
  );
}
