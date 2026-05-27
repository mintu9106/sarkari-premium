"use client";

import { useLanguage } from '@/context/LanguageContext';
import TranslateText from '@/components/TranslateText';

export default function QuickLinks({ applyLink, officialPdfLink, isState }) {
  const { language } = useLanguage();

  // Helper to get language-specific PDF link
  const getPdfLink = () => {
    if (!officialPdfLink) return null;
    
    // Annapurna Bhandar specific handling
    if (officialPdfLink.includes("Annapurna_Yojana_Family_Level_Data_Collection_Form")) {
      if (language === 'bn') {
        return officialPdfLink.replace("Form_English.pdf", "Form_Bangla.pdf");
      }
      if (language === 'hi') {
        return officialPdfLink.replace("Form_English.pdf", "Form_Hindi.pdf");
      }
      return officialPdfLink.replace("Form_English.pdf", "Form_English.pdf");
    }
    
    return officialPdfLink;
  };

  const pdfLink = getPdfLink();

  // For display badge
  const getLanguageLabel = (lang) => {
    if (lang === 'bn') return 'বাংলা';
    if (lang === 'hi') return 'हिंदी';
    return 'English';
  };

  return (
    <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
      <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b border-[var(--border-color)]">
        <TranslateText text="Official Scheme Links" />
      </h3>
      <div className="flex flex-col gap-3">
        {applyLink && (
          <a
            href={applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2.5 px-4 text-white text-center font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm ${
              isState ? 'bg-violet-600 hover:bg-violet-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <TranslateText text="Apply Online Link" />
          </a>
        )}
        {pdfLink && (
          <a
            href={pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-center font-bold text-sm rounded-lg border border-[var(--border-color)] transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="flex items-center gap-1.5">
              <TranslateText text="Download Official PDF" />
              {language !== 'en' && (
                <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black tracking-wide uppercase">
                  {getLanguageLabel(language)}
                </span>
              )}
            </span>
          </a>
        )}
      </div>
    </section>
  );
}
