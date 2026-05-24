"use client";

import Link from 'next/link';

export default function Ticker({ updates = [] }) {
  // If no updates passed, use default mock notices
  const items = updates.length > 0 ? updates : [
    { text: "UPSC Civil Services 2026 Notification out - Apply now!", url: "/jobs/upsc-civil-services-exam-2026" },
    { text: "SSC CGL Exam Dates Announced - Check Schedule", url: "/jobs/ssc-cgl-recruitment-2026" },
    { text: "Railway RRB NTPC Admit Cards Released - Download Link Active", url: "/jobs/kolkata-municipal-corporation-clerk-vacancy-2026" },
    { text: "Patna Block Extension Officer Vacancies - Apply Now", url: "/jobs/patna-block-extension-officer-recruitment-2026" }
  ];

  return (
    <div className="w-full bg-[var(--ticker-bg)] text-[var(--ticker-text)] h-10 flex items-center overflow-hidden border-b border-gray-200 dark:border-gray-800 text-sm font-medium select-none z-40 relative">
      {/* Label */}
      <div className="bg-amber-500 text-black px-4 py-2 font-bold uppercase tracking-wider flex items-center z-10 shadow-lg text-xs h-full shrink-0">
        Latest Updates
      </div>
      
      {/* Scroll Text */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        <div className="animate-ticker flex whitespace-nowrap gap-12 pl-4">
          {items.map((item, index) => (
            <span key={index} className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <Link href={item.url} className="hover:text-amber-400 hover:underline transition-all">
                {item.text}
              </Link>
            </span>
          ))}
          {/* Duplicate items for infinite scroll loop effect */}
          {items.map((item, index) => (
            <span key={`dup-${index}`} className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <Link href={item.url} className="hover:text-amber-400 hover:underline transition-all">
                {item.text}
              </Link>
            </span>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 25s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
