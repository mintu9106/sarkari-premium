"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { language, changeLanguage } = useLanguage();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const states = ["Uttar Pradesh", "West Bengal", "Bihar", "Delhi", "Maharashtra", "Madhya Pradesh", "Rajasthan"];
  const districts = ["Patna", "Kolkata", "Lucknow", "Mumbai", "Jaipur", "Bhopal"];

  // Fetch all jobs for search index when component loads
  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .catch(e => console.error("Search index fetch failed:", e))
      .then(data => {
        if (Array.isArray(data)) {
          setSearchIndex(data);
        }
      });
  }, []);

  // Filter search matches as query text updates
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase().trim();
    const filtered = searchIndex.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.department.toLowerCase().includes(query) ||
      (item.state && item.state.toLowerCase().includes(query)) ||
      (item.district && item.district.toLowerCase().includes(query))
    );
    setSearchResults(filtered);
  }, [searchQuery, searchIndex]);

  // Global keydown listeners for Escape key and Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(open => !open);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--card-bg)]/95 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Title */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="bg-amber-500 text-black px-2.5 py-1 rounded font-black text-lg tracking-wider transform group-hover:scale-105 transition-all shadow-md">SARKARI</span>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">PREMIUM</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <Link href="/central-jobs" className="px-3 py-2 rounded-md text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
              Central Jobs
            </Link>

            {/* State-wise Jobs Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('state')}
                className="px-3 py-2 rounded-md text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center gap-1 cursor-pointer"
              >
                States
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'state' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'state' && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 py-1 z-50">
                  {states.map((state) => (
                    <Link
                      key={state}
                      href={`/state-jobs/${state.toLowerCase().replace(' ', '-')}`}
                      onClick={() => setActiveDropdown(null)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {state}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/gov-schemes" className="px-3 py-2 rounded-md text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
              Govt Schemes
            </Link>

            <Link href="/admit-cards" className="px-3 py-2 rounded-md text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
              Admit Cards
            </Link>

            <Link href="/results" className="px-3 py-2 rounded-md text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
              Results
            </Link>
          </nav>

          {/* Action buttons (Theme Toggle, Search trigger, Mobile menu toggle) */}
          <div className="flex items-center gap-3">
            {/* Search Input Trigger (Desktop) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-400 text-xs transition-all w-48 xl:w-60 select-none text-left cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search updates...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-250 bg-gray-150 px-1.5 font-mono text-[9px] font-medium text-gray-500 opacity-100 dark:border-gray-600 dark:bg-gray-700">
                <span className="text-[7px]">Ctrl+</span>K
              </kbd>
            </button>

            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none cursor-pointer"
              aria-label="Open search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('lang')}
                className="px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 flex items-center gap-1 cursor-pointer"
              >
                🌐 {language}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'lang' && (
                <div className="absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 py-1 z-50">
                  <button
                    onClick={() => { changeLanguage('en'); setActiveDropdown(null); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold ${language === 'en' ? 'text-amber-500' : 'text-gray-700 dark:text-gray-300'} hover:bg-amber-50 dark:hover:bg-amber-950/20`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { changeLanguage('hi'); setActiveDropdown(null); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold ${language === 'hi' ? 'text-amber-500' : 'text-gray-700 dark:text-gray-300'} hover:bg-amber-50 dark:hover:bg-amber-950/20`}
                  >
                    हिन्दी
                  </button>
                  <button
                    onClick={() => { changeLanguage('bn'); setActiveDropdown(null); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold ${language === 'bn' ? 'text-amber-500' : 'text-gray-700 dark:text-gray-300'} hover:bg-amber-50 dark:hover:bg-amber-950/20`}
                  >
                    বাংলা
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-2 pt-2 pb-4 space-y-1 shadow-inner">
          <Link href="/central-jobs" className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-950/20" onClick={() => setMobileMenuOpen(false)}>
            Central Jobs
          </Link>
          <div className="px-3 py-2 text-base font-bold text-gray-400 select-none">States:</div>
          <div className="grid grid-cols-2 gap-1 px-3 pb-2">
            {states.slice(0, 6).map((state) => (
              <Link
                key={state}
                href={`/state-jobs/${state.toLowerCase().replace(' ', '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm py-1.5 text-gray-600 dark:text-gray-300 hover:text-amber-500"
              >
                {state}
              </Link>
            ))}
          </div>
          <Link href="/gov-schemes" className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-950/20" onClick={() => setMobileMenuOpen(false)}>
            Govt Schemes
          </Link>
          <Link href="/admit-cards" className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-950/20" onClick={() => setMobileMenuOpen(false)}>
            Admit Cards
          </Link>
          <Link href="/results" className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-950/20" onClick={() => setMobileMenuOpen(false)}>
            Results
          </Link>
        </div>
      )}

      {/* Instant Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSearchOpen(false)}
          ></div>
          
          {/* Search Card */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-gray-250 dark:border-gray-800 shadow-2xl overflow-hidden max-h-[70vh] flex flex-col transition-all">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search jobs, admit cards, or exam results..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent border-0 outline-none text-gray-900 dark:text-white text-base placeholder-gray-400"
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white px-2 py-1 rounded font-bold cursor-pointer"
              >
                ESC
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {searchQuery.trim() === "" ? (
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Trending / Recent Searches</h4>
                  <div className="space-y-2">
                    {searchIndex.slice(0, 5).map(job => (
                      <Link
                        key={job.slug}
                        href={
                          job.category === 'Admit Cards' 
                            ? `/admit-cards/${job.slug}` 
                            : job.category === 'Results' 
                              ? `/results/${job.slug}` 
                              : `/jobs/${job.slug}`
                        }
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all group"
                      >
                        <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-amber-500 transition-colors">{job.title}</span>
                        <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-extrabold uppercase shrink-0 ${
                          job.category === 'Admit Cards'
                            ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                            : job.category === 'Results'
                              ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450'
                              : 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450'
                        }`}>
                          {job.category === 'Admit Cards' ? 'Admit Card' : job.category === 'Results' ? 'Result' : 'Job'}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Search Results ({searchResults.length})</h4>
                  {searchResults.map(job => (
                    <Link
                      key={job.slug}
                      href={
                        job.category === 'Admit Cards' 
                          ? `/admit-cards/${job.slug}` 
                          : job.category === 'Results' 
                            ? `/results/${job.slug}` 
                            : `/jobs/${job.slug}`
                      }
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-all group"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-amber-500 transition-colors">{job.title}</span>
                        <span className="text-[9px] text-gray-400">{job.department}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-[4px] text-[9px] font-extrabold uppercase shrink-0 self-start ${
                        job.category === 'Admit Cards'
                          ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                          : job.category === 'Results'
                            ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450'
                      }`}>
                        {job.category === 'Admit Cards' ? 'Admit Card' : job.category === 'Results' ? 'Result' : 'Job'}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-sm text-gray-500">
                  No matching jobs, admit cards, or results found for "{searchQuery}"
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900/60 text-[10px] text-gray-400 dark:text-gray-500 flex justify-between">
              <span>Press <kbd className="font-mono bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded text-[8px]">Esc</kbd> to close</span>
              <span>Search index cached dynamically</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
