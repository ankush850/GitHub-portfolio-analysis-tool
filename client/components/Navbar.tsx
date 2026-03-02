import Link from 'next/link';
import { Github, Search, BarChart3, Mail, LogIn } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 glass-panel border-b border-white/5 shadow-2xl shadow-blue-900/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                        <Github className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                        Giteval
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                    <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors">
                        <Search className="w-4 h-4" /> How it Works
                    </Link>
                    <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors">
                        <BarChart3 className="w-4 h-4" /> Examples
                    </Link>
                    <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors">
                        <Mail className="w-4 h-4" /> Contact
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                        <LogIn className="w-4 h-4" /> Login
                    </button>
                </div>
            </div>
        </header>
    );
}
