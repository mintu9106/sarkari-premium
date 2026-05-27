"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function ScreenReader() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [supported, setSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1); // Speech speed: 0.8, 1, 1.2, 1.5
  const [showPlayer, setShowPlayer] = useState(false);
  
  const textBlocksRef = useRef([]);
  const currentBlockIdxRef = useRef(0);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
  }, []);

  // Stop speaking when language changes or component unmounts
  useEffect(() => {
    return () => {
      if (supported && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language, supported]);

  // Extract speakable text blocks from the current page
  const extractContentText = () => {
    const mainEl = document.querySelector('article') || document.querySelector('main');
    if (!mainEl) return [];

    const blocks = [];
    
    // Find all headings, paragraphs, table rows, and list items
    const selectors = 'h1, h2, h3, h4, p, li, th, td';
    const elements = mainEl.querySelectorAll(selectors);

    elements.forEach(el => {
      // Exclude text inside search bars, headers, footers, buttons, or navigation panels
      if (
        el.closest('header') || 
        el.closest('footer') || 
        el.closest('.premium-action-btn') || 
        el.closest('button') ||
        el.closest('nav') ||
        el.closest('.notranslate') ||
        el.getAttribute('translate') === 'no'
      ) {
        return;
      }

      const text = el.textContent.trim();
      if (text && text.length > 1 && !blocks.includes(text)) {
        // Strip out code symbols or raw markdown if they leaked
        blocks.push(text);
      }
    });

    return blocks;
  };

  const getVoiceForLanguage = (lang) => {
    if (!supported) return null;
    const voices = window.speechSynthesis.getVoices();
    
    // Exact match for locale
    const localeMap = {
      en: ['en-IN', 'en-US', 'en-GB'],
      hi: ['hi-IN'],
      bn: ['bn-IN', 'bn-BD']
    };

    const targetLocales = localeMap[lang] || ['en-US'];
    
    // Gather all voices matching target locales
    const matchedVoices = voices.filter(v => 
      targetLocales.some(locale => v.lang.toLowerCase().replace('_', '-').includes(locale.toLowerCase()))
    );

    // Fallback to any voice starting with the language prefix
    if (matchedVoices.length === 0) {
      const prefixVoices = voices.filter(v => v.lang.toLowerCase().startsWith(lang));
      if (prefixVoices.length > 0) matchedVoices.push(...prefixVoices);
    }

    if (matchedVoices.length === 0) return null;

    // Prioritize natural sounding human-like voices:
    // 1. Check for "Natural" (Microsoft Online Natural voices)
    const naturalVoice = matchedVoices.find(v => v.name.toLowerCase().includes('natural'));
    if (naturalVoice) return naturalVoice;

    // 2. Check for "Google" (Google Chrome Cloud/Mobile voices)
    const googleVoice = matchedVoices.find(v => v.name.toLowerCase().includes('google'));
    if (googleVoice) return googleVoice;

    // 3. Fallback to default/first voice of that language
    return matchedVoices[0];
  };

  const speakNextBlock = () => {
    if (!supported) return;
    
    const synth = window.speechSynthesis;
    
    // If we finished all blocks
    if (currentBlockIdxRef.current >= textBlocksRef.current.length) {
      handleStop();
      return;
    }

    const text = textBlocksRef.current[currentBlockIdxRef.current];
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Set appropriate voice
    const voice = getVoiceForLanguage(language);
    if (voice) utterance.voice = voice;
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-US';
    
    // Set rate/speed
    utterance.rate = rate;
    
    utterance.onEnd = () => {
      currentBlockIdxRef.current += 1;
      speakNextBlock();
    };

    utterance.onError = (e) => {
      console.error("SpeechSynthesisUtterance error:", e);
      // Skip and try next if error occurred (except when cancelled)
      if (isPlaying) {
        currentBlockIdxRef.current += 1;
        speakNextBlock();
      }
    };

    synth.speak(utterance);
  };

  const handlePlay = () => {
    if (!supported) return;
    
    const synth = window.speechSynthesis;
    
    if (isPaused) {
      // Resume from paused state
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Cancel any active speech
    synth.cancel();
    
    // Extract text blocks dynamically
    const blocks = extractContentText();
    if (blocks.length === 0) {
      alert("No readable content found on this page.");
      return;
    }

    textBlocksRef.current = blocks;
    currentBlockIdxRef.current = 0;
    
    setIsPlaying(true);
    setIsPaused(false);
    setShowPlayer(true);
    
    speakNextBlock();
  };

  const handlePause = () => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setShowPlayer(false);
    currentBlockIdxRef.current = 0;
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
    if (isPlaying) {
      // Re-speak current block with new rate
      const synth = window.speechSynthesis;
      synth.cancel();
      speakNextBlock();
    }
  };

  // Only show screen reader button on detail pages: /jobs/[slug], /admit-cards/[slug], /results/[slug], /gov-schemes/[slug]
  const isDetailPage = () => {
    if (!pathname) return false;
    const segments = pathname.split('/').filter(Boolean);
    return segments.length === 2 && ['jobs', 'admit-cards', 'results', 'gov-schemes'].includes(segments[0]);
  };

  if (!supported || !isDetailPage()) return null;

  return (
    <>
      {/* Floating Activate Button */}
      {!showPlayer && (
        <button
          onClick={handlePlay}
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-black text-xs rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-amber-400 group cursor-pointer"
          title="Listen to this page (Screen Reader)"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
          </span>
          <svg className="w-4 h-4 text-black group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <span>SCREEN READER</span>
        </button>
      )}

      {/* Glassmorphic Floating TTS Controller Panel */}
      {showPlayer && (
        <div className="fixed bottom-6 right-6 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 min-w-[280px] max-w-[320px] transition-all animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Speaking ({language})</span>
            </div>
            <button 
              onClick={handleStop}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-250 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            {/* Play/Pause Button */}
            {isPlaying ? (
              <button 
                onClick={handlePause}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center shadow transition-all cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 9v6m4-6v6" />
                </svg>
              </button>
            ) : (
              <button 
                onClick={handlePlay}
                className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-black flex items-center justify-center shadow-lg transition-all cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            )}

            {/* Stop Button */}
            <button 
              onClick={handleStop}
              className="w-10 h-10 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 10h6v4H9z" />
              </svg>
            </button>
          </div>

          {/* Speed Rate Control */}
          <div className="flex flex-col gap-1.5 border-t border-gray-100 dark:border-gray-800 pt-3">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Speech Speed</span>
            <div className="flex justify-between gap-1.5">
              {[0.8, 1, 1.25, 1.5].map(r => (
                <button
                  key={r}
                  onClick={() => handleRateChange(r)}
                  className={`flex-1 py-1 rounded text-[10px] font-black transition-all cursor-pointer ${
                    rate === r
                      ? "bg-amber-500 text-black shadow-sm"
                      : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
