import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GitHub Portfolio Analyzer',
  description: 'Transform your GitHub profile into a recruiter-ready portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-start w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {children}
        </main>

        <footer className="border-t border-slate-800 py-8 bg-slate-900/50 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
            <p>© 2026 GitHub Portfolio Analyzer</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/terms" className="hover:text-blue-400 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link>
              <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
