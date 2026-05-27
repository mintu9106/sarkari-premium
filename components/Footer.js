import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Intro */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-amber-500 text-black px-2 py-0.5 rounded font-black text-sm tracking-wider">SARKARI</span>
              <span className="font-extrabold text-md tracking-tight text-gray-900 dark:text-white">PREMIUM</span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm">
              Sarkari Premium is India's premium job portal providing instant, human-written, and well-structured government job notifications, admit cards, and results. We aim to simplify your career search with zero clutter.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider mb-4">Categories</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/central-jobs" className="hover:text-amber-500 transition-colors">Central Govt Jobs</Link></li>
              <li><Link href="/gov-schemes" className="hover:text-amber-500 transition-colors">Govt Schemes</Link></li>
              <li><Link href="/admit-cards" className="hover:text-amber-500 transition-colors">Admit Cards</Link></li>
              <li><Link href="/results" className="hover:text-amber-500 transition-colors">Latest Results</Link></li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
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
