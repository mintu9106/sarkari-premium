"use client";

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { language, changeLanguage } = useLanguage();

  const states = ["Uttar Pradesh", "West Bengal", "Bihar", "Delhi", "Maharashtra", "Madhya Pradesh", "Rajasthan"];
  const districts = ["Patna", "Kolkata", "Lucknow", "Mumbai", "Jaipur", "Bhopal"];

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
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
              Home
            </Link>
            
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

            {/* District-wise Jobs Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('district')}
                className="px-3 py-2 rounded-md text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all flex items-center gap-1 cursor-pointer"
              >
                Districts
                <svg className={`w-4 h-4 transition-transform ${activeDropdown === 'district' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === 'district' && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 py-1 z-50">
                  {districts.map((dist) => (
                    <Link
                      key={dist}
                      href={`/district-jobs/${dist.toLowerCase()}`}
                      onClick={() => setActiveDropdown(null)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {dist}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/admit-cards" className="px-3 py-2 rounded-md text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
              Admit Cards
            </Link>

            <Link href="/results" className="px-3 py-2 rounded-md text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
              Results
            </Link>
          </nav>

          {/* Action buttons (Theme Toggle, Search trigger, Mobile menu toggle) */}
          <div className="flex items-center gap-3">
            {/* Search Input (Hidden on mobile) */}
            <div className="hidden lg:block relative">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-48 xl:w-60 px-3.5 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:focus:ring-amber-400/50 text-sm transition-all focus:w-64"
                id="header-search-input"
              />
              <svg className="w-4 h-4 text-gray-400 absolute right-3.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

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
          <Link href="/" className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-950/20" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
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
          <Link href="/admit-cards" className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-950/20" onClick={() => setMobileMenuOpen(false)}>
            Admit Cards
          </Link>
          <Link href="/results" className="block px-3 py-2 rounded-md text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-amber-950/20" onClick={() => setMobileMenuOpen(false)}>
            Results
          </Link>
        </div>
      )}
    </header>
  );
}
