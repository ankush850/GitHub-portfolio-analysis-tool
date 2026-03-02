"use client";

import Link from 'next/link';
import { Bot, Search, BarChart3, Star, Zap, Github, ArrowRight, GitFork, ShieldAlert, Target } from 'lucide-react';

export default function HowItWorks() {
    return (
        <div className="min-h-screen pt-20 pb-16 px-4 animate-fade-in relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto z-10 relative">
                <div className="text-center mb-16 animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                        <Bot className="w-4 h-4" /> AI-Powered Analysis
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        How Giteval <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Works</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Giteval connects directly to the GitHub API, pulling public data from your profile and repositories. We then simulate a rigorous technical audit to grade your engineering standard.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Step 1 */}
                    <div className="glass-panel p-8 md:p-10 rounded-3xl flex flex-col md:flex-row gap-8 items-center border border-slate-700/50 hover:border-blue-500/30 transition-all shadow-xl">
                        <div className="w-24 h-24 shrink-0 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center text-blue-400">
                            <Search className="w-10 h-10" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm">1</span>
                                <h2 className="text-2xl font-bold text-white">Data Extraction</h2>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                When you input a GitHub username, our system safely fetches your public repositories, commit history, and language diversity using the official GitHub REST API.
                            </p>
                            <div className="flex gap-2 text-xs font-mono text-slate-500">
                                <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">GET /users/:username</span>
                                <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">GET /users/:username/repos</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="glass-panel p-8 md:p-10 rounded-3xl flex flex-col md:flex-row-reverse gap-8 items-center border border-slate-700/50 hover:border-purple-500/30 transition-all shadow-xl">
                        <div className="w-24 h-24 shrink-0 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center text-purple-400">
                            <Bot className="w-10 h-10" />
                        </div>
                        <div className="flex-1 md:text-right">
                            <div className="flex items-center md:flex-row-reverse gap-3 mb-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm">2</span>
                                <h2 className="text-2xl font-bold text-white">Rigorous AI Analysis</h2>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Our backend engine runs a strict algorithmic and AI-based audit on your repositories. We don't just count stars; we parse your READMEs for structural quality, evaluate commit consistency, and check repository file configurations.
                            </p>
                            <div className="flex flex-wrap md:justify-end gap-2 text-xs font-medium">
                                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20"><Search className="w-3 h-3 inline mt-[-2px] mr-1" />Documentation Check</span>
                                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded border border-yellow-500/20"><GitFork className="w-3 h-3 inline mt-[-2px] mr-1" />Commit Frequency</span>
                                <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded border border-red-500/20"><ShieldAlert className="w-3 h-3 inline mt-[-2px] mr-1" />Red Flag Detection</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="glass-panel p-8 md:p-10 rounded-3xl flex flex-col md:flex-row gap-8 items-center border border-slate-700/50 hover:border-emerald-500/30 transition-all shadow-xl">
                        <div className="w-24 h-24 shrink-0 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center text-emerald-400">
                            <BarChart3 className="w-10 h-10" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-sm">3</span>
                                <h2 className="text-2xl font-bold text-white">Scoring & Simulation</h2>
                            </div>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                You receive a tough, merit-based portfolio grade. Finally, we pass the extracted data to an AI model configured to behave exactly like a FAANG technical recruiter, returning actionable insights and suggesting interview questions based on your work.
                            </p>
                            <div className="flex gap-2 text-xs font-medium">
                                <span className="px-2 py-1 bg-slate-800 text-white rounded border border-slate-700"><Target className="w-3 h-3 inline mt-[-2px] mr-1" />Score 0-100</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center bg-slate-900/40 p-10 rounded-3xl border border-slate-800 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-4">Ready to test your portfolio?</h3>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">See exactly what a recruiter sees when they look at your code.</p>
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full font-semibold text-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        Analyze My Profile <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
