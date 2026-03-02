"use client";

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Eye, Database, Lock } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-8 animate-fade-in">
            <div className="w-full mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>

            <div className="glass-panel w-full rounded-3xl p-8 md:p-12 relative overflow-hidden border border-emerald-500/10 shadow-xl">
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />

                <div className="mb-10 text-center relative z-10">
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-6 relative">
                        <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Privacy Policy</h1>
                    <p className="text-slate-400">Last updated: March 2, 2026</p>
                </div>

                <div className="space-y-8 text-slate-300 leading-relaxed relative z-10">

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-white border-b border-slate-800 pb-2">
                            <Eye className="w-5 h-5 text-blue-400" />
                            1. Information We Collect
                        </h2>
                        <p>
                            Our Service analyzes public data provided by GitHub. When you enter a GitHub username, we retrieve and process public information associated with that profile, including repositories, commit history, and code languages.
                        </p>
                        <p className="text-emerald-400 text-sm font-medium">
                            * We do NOT require, ask for, or store any private GitHub tokens, passwords, or personal credentials from our users.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-white border-b border-slate-800 pb-2">
                            <Database className="w-5 h-5 text-purple-400" />
                            2. How We Use Your Data
                        </h2>
                        <p>
                            We use the public data fetched from GitHub purely to generate your Portfolio Score, render visualization charts, and simulate recruiter feedback.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-400">
                            <li>We do not sell this data to third parties.</li>
                            <li>We do not use this data for marketing purposes.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-white border-b border-slate-800 pb-2">
                            <Lock className="w-5 h-5 text-yellow-400" />
                            3. Data Storage & Security
                        </h2>
                        <p>
                            Our backend service securely connects to the GitHub API. Analysis results may be temporarily cached in memory to improve performance and avoid hitting GitHub API rate limits. We employ standard web security practices to ensure your interactions with our site remain safe.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-3 text-white border-b border-slate-800 pb-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-400" />
                            4. Third-Party Services
                        </h2>
                        <p>
                            Our service utilizes the official GitHub REST API. By using our application, you are requesting data from GitHub; please review the official GitHub Privacy Statement for details on how they handle public data.
                        </p>
                    </section>

                </div>

                <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500 relative z-10">
                    If you have any questions about this Privacy Policy, please contact us at privacy@portfolioanalyzer.app.
                </div>
            </div>
        </div>
    );
}
