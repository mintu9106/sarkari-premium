"use client";

import { useState, useEffect } from 'react';
import TranslateText from './TranslateText';

export default function JobShareButtons({ title = "", slug = "" }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.origin + window.location.pathname);
    }
  }, [slug]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareText = `${title} - Apply Online, Exam Dates, Eligibility Criteria: `;

  return (
    <section className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] space-y-4">
      <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white pb-2 border-b border-[var(--border-color)]">
        <TranslateText text="Share this Job" />
      </h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        
        {/* WhatsApp Button */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold transition-all shadow-sm"
        >
          {/* WhatsApp SVG Icon */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.405.002 9.803-4.381 9.805-9.782.001-2.592-1.002-5.029-2.827-6.857-1.825-1.829-4.259-2.836-6.86-2.838-5.406 0-9.803 4.383-9.807 9.785-.002 1.83.486 3.615 1.413 5.178l-.988 3.604 3.739-.981zm11.58-5.33c-.267-.134-1.582-.78-1.827-.869-.247-.09-.427-.134-.607.134-.18.267-.697.869-.854 1.047-.156.179-.311.202-.578.068-.267-.134-1.13-.417-2.153-1.328-.795-.71-1.333-1.586-1.489-1.854-.156-.267-.017-.412.117-.546.12-.12.267-.312.4-.468.133-.156.178-.267.267-.446.089-.178.044-.334-.022-.468-.067-.134-.607-1.462-.832-2.007-.219-.526-.441-.454-.607-.462-.156-.007-.334-.008-.512-.008-.178 0-.468.067-.713.334-.244.268-.935.914-.935 2.229 0 1.315.957 2.584 1.09 2.762.134.179 1.884 2.877 4.565 4.032.637.275 1.135.439 1.523.563.64.203 1.222.174 1.682.105.513-.077 1.582-.647 1.805-1.272.222-.624.222-1.159.155-1.272-.066-.112-.245-.178-.512-.312z" />
          </svg>
          <span>WhatsApp</span>
        </a>

        {/* Telegram Button */}
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold transition-all shadow-sm"
        >
          {/* Telegram SVG Icon */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 .02c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.294.294-.602.294l.213-3.05 5.56-5.022c.242-.213-.054-.333-.373-.12l-6.87 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.537-.2.108.108.356.953z" />
          </svg>
          <span>Telegram</span>
        </a>

        {/* Facebook Button */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold transition-all shadow-sm"
        >
          {/* Facebook SVG Icon */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </a>

        {/* X / Twitter Button */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-black hover:bg-gray-900 text-white font-bold transition-all shadow-sm border border-gray-800"
        >
          {/* X (formerly Twitter) SVG Icon */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Twitter / X</span>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={copyToClipboard}
          className={`col-span-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-bold border transition-all cursor-pointer ${
            copied
              ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
              : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-300"
          }`}
        >
          {copied ? (
            <>✓ <TranslateText text="Link Copied to Clipboard!" /></>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <TranslateText text="Copy Page Link" />
            </>
          )}
        </button>
      </div>
    </section>
  );
}
