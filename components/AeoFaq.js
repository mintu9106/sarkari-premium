'use client';

import { useState } from 'react';
import TranslateText from '@/components/TranslateText';

export default function AeoFaq({ job }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!job) return null;

  const renderTextOrList = (val) => {
    if (!val) return '';
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
      }).filter(Boolean).join(', ');
    }
    return JSON.stringify(val);
  };

  const getFaqs = () => {
    const title = job.title;
    const cat = job.category;
    const eligibility = renderTextOrList(job.eligibility);
    const ageLimit = renderTextOrList(job.age_limit);
    const salary = renderTextOrList(job.salary);
    const applyLink = job.apply_link;
    const howToApply = renderTextOrList(job.how_to_apply);
    const startDate = job.important_dates?.start_date;
    const endDate = job.important_dates?.end_date;
    const examDate = job.important_dates?.exam_date;

    if (cat === 'Govt Schemes') {
      return [
        {
          q: `What is the objective of the ${title} Scheme?`,
          a: job.overview || `The ${title} is a welfare program initiated by the government to support eligible beneficiaries.`
        },
        {
          q: `Who is eligible for the ${title} Scheme?`,
          a: eligibility || `Eligible citizens residing in the respective region who meet the specific income, occupation, or demographic criteria.`
        },
        {
          q: `What are the benefits of ${title}?`,
          a: salary || `Beneficiaries receive financial assistance, subsidies, medical support, or direct benefits as structured in the scheme guidelines.`
        },
        {
          q: `How can I apply for the ${title} Scheme?`,
          a: howToApply || `Applicants can register online through the official government portal or visit the nearest block/municipality office with their documents.`
        }
      ];
    }

    if (cat === 'Admit Cards') {
      return [
        {
          q: `How to download the ${title} Admit Card?`,
          a: howToApply || `Visit the official portal, click on the download admit card link, enter your registration details, and download your hall ticket.`
        },
        {
          q: `What is the exam date for ${title}?`,
          a: examDate ? `The examination is scheduled to be held on ${examDate}.` : `The exam date will be announced officially by the department soon.`
        },
        {
          q: `What documents do I need to carry to the ${title} exam hall?`,
          a: `You must carry a clear printed copy of your Admit Card along with a valid original government photo identity proof (Aadhar Card, PAN Card, Voter ID, or Passport).`
        }
      ];
    }

    if (cat === 'Results') {
      return [
        {
          q: `How can I check the ${title} Result?`,
          a: howToApply || `Go to the official board portal, locate the results section, enter your roll number or download the merit list selection PDF.`
        },
        {
          q: `What details are required to check the ${title} selection status?`,
          a: `You will need your registration number, roll number, or date of birth to check your results on the portal, or you can search your roll number in the published merit list PDF.`
        },
        {
          q: `Where can I download the merit list for ${title}?`,
          a: `The merit list and cut-off marks will be available for download directly from the official board website or PDF links provided in the notification section.`
        }
      ];
    }

    // Default: Jobs (Central, State, District)
    return [
      {
        q: `What is the educational qualification for ${title}?`,
        a: eligibility || `Candidates must satisfy the qualification criteria specified in the official notification.`
      },
      {
        q: `What is the age limit for the ${title} recruitment?`,
        a: ageLimit ? `The required age limit is: ${ageLimit}. Age relaxation is applicable for reserved categories as per government rules.` : `Age limits are defined as per the state/central government recruitment norms.`
      },
      {
        q: `What is the salary scale for ${title} posts?`,
        a: salary || `Selected candidates will receive a pay scale according to the official department pay matrix and allowances.`
      },
      {
        q: `What are the registration dates for ${title}?`,
        a: (startDate && endDate) 
          ? `The online application starts on ${startDate} and the last date to submit the form is ${endDate}.`
          : `Please check the official timelines and schedules table on our detail page for the latest registration dates.`
      },
      {
        q: `How to apply online for ${title}?`,
        a: howToApply || `Eligible candidates can fill out the application form on the official recruitment website before the closing date.`
      }
    ];
  };

  const faqs = getFaqs();

  // Build JSON-LD FAQPage Schema for Search Engines
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4">
        <div className="w-2.5 h-6 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          <TranslateText text="Frequently Asked Questions (FAQ) & Quick Answers" />
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className="border border-slate-100 dark:border-slate-800/60 rounded-xl overflow-hidden transition-all duration-300 bg-slate-50/50 dark:bg-slate-950/20"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/40 dark:hover:bg-slate-800/25 transition-all duration-200"
              >
                <span>
                  <TranslateText text={faq.q} />
                </span>
                <span className="ml-4 shrink-0 text-slate-400">
                  <svg 
                    className={`w-4 h-4 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/40 text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                  <TranslateText text={faq.a} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
