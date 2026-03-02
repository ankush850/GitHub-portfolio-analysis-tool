"use client";

import { use, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Star, GitFork, AlertTriangle, CheckCircle2, FileText, Code, Search, Loader2 } from 'lucide-react';

export default function RepoDetailWrapper({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div className="flex h-64 items-center justify-center animate-pulse"><Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-2" /> Loading Details...</div>}>
            <RepoDetail params={params} />
        </Suspense>
    );
}

function RepoDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const repoName = resolvedParams.id;
    const searchParams = useSearchParams();
    const username = searchParams.get('user') || 'octocat';

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:8000/api/v1/analyze/${username}/${repoName}`)
            .then(res => res.json())
            .then(res => {
                if (res.detail) throw new Error(res.detail);
                setData(res);
                setLoading(false);
            })
            .catch(e => {
                setError(e.message);
                setLoading(false);
            });
    }, [username, repoName]);

    if (loading) {
        return (
            <div className="w-full h-[60vh] flex flex-col justify-center items-center text-white gap-4 border border-blue-500/20 glass-panel mt-10 rounded-3xl animate-fade-in max-w-4xl mx-auto">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <span className="text-xl font-medium tracking-wide">Fetching Live Repository State...</span>
                <span className="text-sm text-slate-400 font-mono">github.com/{username}/{repoName}</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-20 animate-fade-in text-red-500 gap-4 glass-panel rounded-3xl mt-10 p-8 border border-red-500/30">
                <AlertTriangle className="w-12 h-12" />
                <span className="text-xl font-bold">Failed to Fetch Live Data</span>
                <span className="text-slate-300 text-sm text-center">{error}</span>
                <Link href={`/dashboard?username=${username}`} className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white transition">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    const currentRepo = data?.analysis;
    if (!currentRepo) return null;

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in pt-4">
            <Link href={`/dashboard?username=${username}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-4 w-max">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-blue-500/20 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-slate-800 pb-8 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="text-blue-500 w-8 h-8" />
                            <h1 className="text-3xl font-extrabold text-white break-words">
                                {currentRepo.name}
                            </h1>
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                            {currentRepo.description || "No description provided."}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 mt-6">
                            <a href={currentRepo.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm px-4 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 rounded-full transition">
                                View on GitHub
                            </a>
                            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                                <Star className="w-4 h-4 text-yellow-500" /> {currentRepo.stars}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                                <GitFork className="w-4 h-4 text-slate-400" /> {currentRepo.forks}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center bg-slate-900/80 p-6 rounded-2xl border border-slate-700 shadow-inner min-w-[150px] shrink-0">
                        <span className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">Live Score</span>
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                            {currentRepo.score?.overall || 0}
                        </div>
                        <div className="text-xl font-bold text-slate-500 mt-1">Grade {currentRepo.score?.grade || "F"}</div>
                    </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="space-y-6 mb-10 relative z-10">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-200 border-b border-slate-800 pb-3">
                        <Code className="w-5 h-5 text-purple-400" /> Live Metrics Analysis
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-medium text-slate-300">Documentation</span>
                                <span className="font-bold text-emerald-400">{currentRepo.score?.documentation || 0}/100</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                README Length: {currentRepo.documentation_analysis?.readme_length || 0} chars<br />
                                {currentRepo.documentation_analysis?.has_setup_instructions ? '✅ Setup found' : '❌ No setup found'}
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-medium text-slate-300">Code Quality</span>
                                <span className="font-bold text-emerald-400">{currentRepo.score?.code_quality || 0}/100</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Primary: {currentRepo.code_analysis?.primary_language || 'Unknown'}<br />
                                Diversity: {(currentRepo.code_analysis?.languages_used || []).length} languages
                            </p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-medium text-slate-300">Activity</span>
                                <span className="font-bold text-yellow-400">{currentRepo.score?.activity || 0}/100</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Status: {currentRepo.activity_analysis?.is_active ? 'Active' : 'Inactive'}<br />
                                Frequency: {currentRepo.activity_analysis?.commit_frequency || 0} / day
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-6">
                        <h4 className="font-bold text-emerald-400 flex items-center gap-2 mb-4 text-lg border-b border-emerald-500/20 pb-3">
                            <CheckCircle2 className="w-5 h-5" /> Current Strengths
                        </h4>
                        <ul className="space-y-3">
                            {currentRepo.strengths?.length > 0 ? currentRepo.strengths.map((imp: string, i: number) => (
                                <li key={i} className="text-slate-300 text-sm flex gap-3">
                                    <span className="text-emerald-500 mt-1">✓</span> <span>{imp}</span>
                                </li>
                            )) : (
                                <li className="text-slate-500 text-sm italic">No major strengths identified by AI.</li>
                            )}
                        </ul>
                    </div>

                    <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-6">
                        <h4 className="font-bold text-red-400 flex items-center gap-2 mb-4 text-lg border-b border-red-500/20 pb-3">
                            <AlertTriangle className="w-5 h-5" /> Live Weaknesses
                        </h4>
                        <ul className="space-y-3">
                            {currentRepo.weaknesses?.length > 0 ? currentRepo.weaknesses.map((flag: string, i: number) => (
                                <li key={i} className="text-slate-300 text-sm flex gap-3">
                                    <span className="text-red-500 mt-1 px-1.5 py-0.5 bg-red-500/20 rounded text-[10px] uppercase font-bold tracking-widest">Fix</span>
                                    <span>{flag}</span>
                                </li>
                            )) : (
                                <li className="text-slate-500 text-sm italic flex items-center gap-2 border border-emerald-500/20 bg-emerald-500/5 p-3 rounded-lg"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No major warnings detected!</li>
                            )}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}
