"use client";

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, GitFork, AlertTriangle, CheckCircle2, FileText, Code, Search } from 'lucide-react';

export default function RepoDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    // Simulated repo data
    const repo = {
        id: id,
        name: id,
        desc: 'An awesome detailed view of the repository to show insights.',
        stars: 45,
        forks: 12,
        score: 92,
        grade: 'A',
        metrics: {
            documentation: { score: 95, comment: 'Excellent README with setup instructions.' },
            codeQuality: { score: 88, comment: 'Clean code, good modularity.' },
            activity: { score: 70, comment: 'Recent commits are good, but could be more consistent.' }
        },
        redFlags: [
            'Missing CONTRIBUTING.md',
            'No issue templates found'
        ],
        improvements: [
            'Add a CI/CD pipeline badge',
            'Include a screenshot in the README'
        ]
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in pt-4">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-4">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-blue-500/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-800 pb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                            <FileText className="text-blue-500" />
                            {repo.name}
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">{repo.desc}</p>
                        <div className="flex items-center gap-6 mt-4 opacity-80">
                            <span className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" /> {repo.stars} Stars</span>
                            <span className="flex items-center gap-2"><GitFork className="w-5 h-5 text-slate-400" /> {repo.forks} Forks</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-700 shadow-inner min-w-[150px]">
                        <span className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Repo Score</span>
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            {repo.score}
                        </div>
                        <div className="text-xl font-bold text-slate-500 mt-1">Grade {repo.grade}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200">
                            <Code className="w-5 h-5 text-purple-400" /> Metrics Breakdown
                        </h3>

                        <div className="space-y-4">
                            {Object.entries(repo.metrics).map(([key, data]) => (
                                <div key={key} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="capitalize font-medium text-slate-300">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className={`font-bold ${data.score >= 90 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                            {data.score}/100
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500">{data.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200">
                            <Search className="w-5 h-5 text-amber-400" /> Action Items
                        </h3>

                        {repo.redFlags.length > 0 && (
                            <div className="bg-red-950/30 border border-red-500/20 rounded-xl p-5">
                                <h4 className="font-bold text-red-400 flex items-center gap-2 mb-3">
                                    <AlertTriangle className="w-5 h-5" /> Red Flags
                                </h4>
                                <ul className="space-y-2">
                                    {repo.redFlags.map((flag, i) => (
                                        <li key={i} className="text-slate-300 text-sm flex gap-2">
                                            <span className="text-red-500 mt-1">•</span> {flag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-5">
                            <h4 className="font-bold text-emerald-400 flex items-center gap-2 mb-3">
                                <CheckCircle2 className="w-5 h-5" /> Suggested Improvements
                            </h4>
                            <ul className="space-y-2">
                                {repo.improvements.map((imp, i) => (
                                    <li key={i} className="text-slate-300 text-sm flex gap-2">
                                        <span className="text-emerald-500 mt-1">→</span> {imp}
                                    </li>
                                ))}
                            </ul>
                            <button className="mt-4 w-full py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium transition-colors">
                                Apply Improvements with AI
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
