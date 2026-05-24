"use client";

import { useState, useEffect } from 'react';
import TranslateText from './TranslateText';

export default function JobShareButtons({ title = "", slug = "" }) {
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.origin + "/jobs/" + slug);
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

        {/* Instagram Button */}
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white font-bold transition-all shadow-sm cursor-pointer"
        >
          {/* Instagram SVG Icon */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          <span>Instagram</span>
        </button>

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
