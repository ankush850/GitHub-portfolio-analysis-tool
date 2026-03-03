"use client";

import Link from 'next/link';
import { ArrowLeft, MessageSquare, Mail, Github, ExternalLink } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-8 animate-fade-in">
            <div className="w-full mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>

            <div className="glass-panel w-full rounded-3xl p-8 md:p-12 relative overflow-hidden border border-purple-500/10 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

                <div className="mb-12 text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-full mb-6 relative">
                        <MessageSquare className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Contact & Support</h1>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Have questions about the GitHub Portfolio Analyzer, found a bug, or want to suggest a feature? Reach out directly!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 max-w-2xl mx-auto">

                    {/* Email Card */}
                    <a
                        href="mailto:ankushsinghrawat154@gmail.com"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-900/60 border border-slate-700/50 hover:border-blue-500/50 p-6 rounded-2xl flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] group"
                    >
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white mb-2">Email Me</h2>
                        <p className="text-slate-400 text-sm mb-4">Direct inbox for inquiries and support requests.</p>
                        <span className="text-blue-400 font-medium text-sm flex items-center gap-2 mt-auto">
                            ankushsinghrawat154@gmail.com <ExternalLink className="w-3 h-3" />
                        </span>
                    </a>

                    {/* GitHub Card */}
                    <a
                        href="https://github.com/ankush850"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-900/60 border border-slate-700/50 hover:border-emerald-500/50 p-6 rounded-2xl flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] group"
                    >
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Github className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white mb-2">GitHub Profile</h2>
                        <p className="text-slate-400 text-sm mb-4">Check out my other projects, or report an issue on the repo.</p>
                        <span className="text-emerald-400 font-medium text-sm flex items-center gap-2 mt-auto">
                            github.com/ankush850 <ExternalLink className="w-3 h-3" />
                        </span>
                    </a>

                </div>
            </div>
        </div>
    );
}
