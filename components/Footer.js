import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Follow Us Row */}
          <div className="space-y-4 col-span-2">
            <div className="flex items-start justify-between md:justify-start md:gap-24 w-full">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <img 
                  src="/logo.png" 
                  alt="Sarkari Premium Logo" 
                  className="h-[52px] w-auto"
                />
              </Link>
              
              {/* Follow Us (Heading in the middle of icons) */}
              <div className="space-y-2 shrink-0 flex flex-col items-center">
                <h3 className="text-gray-900 dark:text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider text-center">Follow Us</h3>
                <div className="flex items-center justify-center gap-2.5">
                  <a href="https://t.me/sarkaripremium" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-500 hover:bg-blue-500 hover:text-white transition-all" title="Telegram Channel">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.73 7.59-3.25 3.61-1.48 4.36-1.74 4.85-1.75.11 0 .35.03.51.16.13.1.17.25.19.35.02.13.02.27.01.4z"/>
                    </svg>
                  </a>
                  <a href="https://whatsapp.com/channel/sarkaripremium" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-green-50 dark:bg-green-950/30 text-green-500 hover:bg-green-500 hover:text-white transition-all" title="WhatsApp Channel">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.83 14c-.24.68-1.2 1.24-1.67 1.32-.47.08-.85.34-3-.51-2.58-1.01-4.22-3.66-4.35-3.83-.13-.17-1.07-1.43-1.07-2.73 0-1.3.68-1.94.92-2.2.24-.26.52-.33.7-.33.18 0 .36 0 .52.01.17.01.39-.06.61.47.23.55.78 1.9.85 2.05.07.15.12.33.02.53-.1.2-.15.33-.3.51-.15.18-.32.41-.46.55-.16.16-.33.33-.14.66.19.33.85 1.39 1.82 2.26.84.75 1.56.98 1.78 1.09.22.11.35.09.48-.06.13-.15.55-.64.7-.86.15-.22.3-.18.51-.1.21.08 1.34.63 1.57.75.23.12.38.18.44.28.06.1.06.58-.18 1.26z"/>
                    </svg>
                  </a>
                  <a href="https://facebook.com/sarkaripremium" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-600 hover:text-white transition-all" title="Facebook Page">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                  </a>
                  <a href="https://youtube.com/@sarkaripremium" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 hover:bg-red-600 hover:text-white transition-all" title="YouTube Channel">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <p className="text-xs leading-relaxed max-w-sm">
              Sarkari Premium is India's premium job portal providing instant, human-written, and well-structured government job notifications, admit cards, and results. We aim to simplify your career search with zero clutter.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider mb-4">Categories</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/central-jobs" className="hover:text-amber-500 transition-colors">Central Govt Jobs</Link></li>
              <li><Link href="/gov-schemes" className="hover:text-amber-500 transition-colors">Govt Schemes</Link></li>
              <li><Link href="/admit-cards" className="hover:text-amber-500 transition-colors">Admit Cards</Link></li>
              <li><Link href="/results" className="hover:text-amber-500 transition-colors">Latest Results</Link></li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div className="col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider mb-4">Information</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-amber-500 transition-colors">About Us</Link></li>
              <li><Link href="/disclaimer" className="hover:text-amber-500 transition-colors">Disclaimer</Link></li>
              <li><Link href="/privacy" className="hover:text-amber-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-amber-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">&copy; {new Date().getFullYear()} Sarkari Premium. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <span className="text-gray-400 select-none">Designed for speed & SEO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
