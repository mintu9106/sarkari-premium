import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import { LanguageProvider } from "@/context/LanguageContext";
import { getJobs, getJobUrl } from "@/lib/db";

export const metadata = {
  title: {
    default: "Sarkari Premium | Latest Govt Jobs, Admit Cards & Results",
    template: "%s | Sarkari Premium"
  },
  description: "India's premium government jobs portal. Get structured, ad-free notifications, eligibility, syllabus, admit cards, and results for UPSC, SSC, Bank, Railways, and State Jobs.",
  metadataBase: new URL("https://sarkari-premium.vercel.app"),
  alternates: {
    canonical: "/"
  }
};

export default async function RootLayout({ children }) {
  let tickerUpdates = [];
  try {
    const jobs = await getJobs();
    tickerUpdates = jobs.slice(0, 8).map(job => {
      let text = `${job.title} - Apply Online Now!`;
      if (job.category === 'Admit Cards') {
        text = `${job.title} - Download Admit Card!`;
      } else if (job.category === 'Results') {
        text = `${job.title} - Exam Result Declared!`;
      }
      return {
        text,
        url: getJobUrl(job.category, job.slug)
      };
    });
  } catch (e) {
    console.error("Failed to fetch jobs for ticker layout:", e);
  }

  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        {/* Anti-flicker script for dark theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased transition-colors duration-300">
        <LanguageProvider>
          <Ticker updates={tickerUpdates} />
          <Header />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
