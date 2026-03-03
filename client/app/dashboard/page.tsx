"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Download, Search, Filter, AlertTriangle, CheckCircle2,
    Github, Star, GitFork, ArrowLeft, Trophy, Calendar, FileText, Activity, Map, Loader2
} from 'lucide-react';

function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const username = searchParams.get('username') || 'octocat';

    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`http://localhost:8000/api/v1/analyze/${username}`)
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
    }, [username]);

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center h-64 animate-fade-in text-white gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="text-xl">Loading analysis for {username}...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center h-64 animate-fade-in text-red-500 gap-4 glass-panel rounded-3xl p-8 border border-red-500/30">
                <AlertTriangle className="w-12 h-12" />
                <span className="text-xl font-bold">Error Displaying Data</span>
                <span className="text-slate-300 text-sm text-center">{error}</span>
                <button onClick={() => router.push('/')} className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-white">Back to Home</button>
            </div>
        );
    }

    // Map backend data to frontend variables
    const profile = {
        username: data.username,
        avatar: data.user_data?.avatar_url || `https://github.com/${username}.png`,
        name: data.user_data?.name || data.username,
        bio: data.user_data?.bio || "No bio available.",
        reposCount: data.user_data?.public_repos || 0,
        followers: data.user_data?.followers || 0,
        overallScore: data.score?.overall || 0,
        grade: data.score?.grade || 'F',
        percentile: 72 // Mock percentile or calculate
    };

    const componentScoresMap = data.score?.breakdown || {
        documentation: 0, code_quality: 0, consistency: 0, impact: 0, depth: 0
    };

    const componentScores = [
        { name: 'Documentation', score: componentScoresMap.documentation || 45, max: 100, status: componentScoresMap.documentation > 70 ? '👍 Good' : '⚠️ Needs Work', color: componentScoresMap.documentation > 70 ? 'bg-emerald-500' : 'bg-yellow-500' },
        { name: 'Code Quality', score: componentScoresMap.code_quality || 72, max: 100, status: componentScoresMap.code_quality > 70 ? '👍 Good' : '⚠️ Needs Work', color: componentScoresMap.code_quality > 70 ? 'bg-emerald-500' : 'bg-yellow-500' },
        { name: 'Consistency', score: componentScoresMap.consistency || 55, max: 100, status: componentScoresMap.consistency > 70 ? '👍 Good' : '⚠️ Needs Work', color: componentScoresMap.consistency > 70 ? 'bg-emerald-500' : 'bg-yellow-500' },
        { name: 'Project Impact', score: componentScoresMap.impact || 85, max: 100, status: componentScoresMap.impact > 80 ? '🌟 Excellent' : '👍 Good', color: componentScoresMap.impact > 80 ? 'bg-blue-500' : 'bg-emerald-500' },
        { name: 'Technical Depth', score: componentScoresMap.depth || 78, max: 100, status: componentScoresMap.depth > 70 ? '👍 Good' : '⚠️ Needs Work', color: componentScoresMap.depth > 70 ? 'bg-emerald-500' : 'bg-yellow-500' }
    ];

    const repos = (data.repositories || []).map((repo: any) => ({
        id: repo.name,
        name: repo.name,
        desc: repo.description || 'No description provided.',
        stars: repo.stars || 0,
        forks: repo.forks || 0,
        langs: Object.entries(repo.languages || {}).map(([name, bytes]: any) => ({
            name, pct: 100, color: 'text-blue-500' // Simplify for MVP
        })).slice(0, 3),
        score: repo.score?.overall || 0,
        grade: repo.score?.grade || 'F',
        warnings: repo.weaknesses || []
    }));

    const filteredRepos = repos.filter((repo: any) => repo.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const decisionData = data.recruiter_feedback?.decision;
    const recruiterDecision = typeof decisionData === 'string'
        ? decisionData
        : (decisionData?.decision || "MAYBE - Schedule Interview");
    const recruiterSummary = data.recruiter_feedback?.summary || "Good projects but documentation needs improvement.";
    const recruiterQuestions = data.recruiter_feedback?.suggested_questions || [];

    const roadmapShort = data.roadmap?.timeline?.immediate?.actions || [];
    const roadmapLong = data.roadmap?.timeline?.short_term?.actions || [];

    return (
        <div className="w-full flex justify-center animate-fade-in">
            <div className="w-full max-w-6xl space-y-8">

                {/* Top Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <img src={profile.avatar} alt={username} className="w-12 h-12 rounded-full border border-slate-700" />
                        <h1 className="text-xl font-bold font-mono">@{username}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push('/')} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-lg text-sm text-slate-300 transition-colors">
                            <Search className="w-4 h-4" /> Analyze Another
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/30">
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>
                </div>

                {/* Hero Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                        <img src={profile.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-slate-800 shadow-xl mb-4" />
                        <h2 className="text-2xl font-bold">{profile.name}</h2>
                        <p className="text-slate-400 text-sm mt-2">{profile.bio}</p>
                        <div className="flex items-center gap-4 mt-4 text-slate-400">
                            <div className="flex items-center gap-1"><Github className="w-4 h-4" /> {profile.reposCount} repos</div>
                            <div className="flex items-center gap-1"><Star className="w-4 h-4" /> {profile.followers} followers</div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                        <h3 className="text-slate-400 font-medium mb-2 uppercase tracking-wider text-sm">Portfolio Score</h3>
                        <div className="flex items-end gap-4 mb-4">
                            <div className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                {profile.overallScore}
                            </div>
                            <div className="text-3xl font-bold text-slate-500 pb-2">/ 100 ({profile.grade})</div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium w-max mb-6">
                            <Trophy className="w-4 h-4" /> Top {100 - profile.percentile}% of all users
                        </div>

                        {/* Visual Gauge representation */}
                        <div className="w-full bg-slate-800 h-6 rounded-full overflow-hidden shadow-inner relative">
                            <div
                                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 border-r-2 border-white transition-all duration-1000"
                                style={{ width: `${profile.overallScore}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Component Scores & Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-400" /> Component Scores
                        </h3>
                        <div className="space-y-4">
                            {componentScores.map((comp, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-300">{comp.name}</span>
                                        <span className="text-slate-400">{Math.round(comp.score)}/{comp.max} &nbsp; {comp.status}</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex justify-start items-center">
                                        <div className={`h-full ${comp.color} transition-all duration-1000`} style={{ width: `${comp.score}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <Search className="w-5 h-5 text-purple-400" /> Key Insights
                        </h3>

                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                            <h4 className="font-bold text-emerald-400 flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-4 h-4" /> Strengths
                            </h4>
                            <ul className="text-sm text-slate-300 space-y-1 ml-6 list-disc marker:text-emerald-500">
                                {data.score?.strengths?.map((str: string, i: number) => <li key={i}>{str}</li>) || <li>Consistent open-source contributions detected.</li>}
                            </ul>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <h4 className="font-bold text-red-400 flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4" /> Red Flags
                            </h4>
                            <ul className="text-sm text-slate-300 space-y-1 ml-6 list-disc marker:text-red-500">
                                {data.score?.weaknesses?.map((str: string, i: number) => <li key={i}>{str}</li>) || <li>Missing READMEs on some projects.</li>}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Repositories */}
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-400" />
                            Repositories Analysis <span className="text-slate-500 font-normal">({repos.length} analyzed)</span>
                        </h3>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <div className="relative flex-grow sm:flex-grow-0 focus-within:ring-2 focus-within:ring-blue-500/50 rounded-lg transition-all">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search repositories..."
                                    className="w-full sm:w-64 bg-slate-900 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredRepos.map((repo: any) => (
                            <div key={repo.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg text-blue-400 font-bold hover:underline cursor-pointer">
                                            <Link href={`/repo/${repo.id}?user=${username}`}>{repo.name}</Link>
                                        </h4>
                                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                                            Score: {repo.score} ({repo.grade})
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-3">{repo.desc}</p>

                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
                                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500" /> {repo.stars}</span>
                                        <span className="flex items-center gap-1"><GitFork className="w-3 h-3 text-slate-400" /> {repo.forks}</span>
                                        <div className="flex gap-2 items-center">
                                            {repo.langs.map((l: any, i: number) => <span key={i} className={l.color}>{l.name}</span>)}
                                        </div>
                                    </div>

                                    {repo.warnings.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-red-400">
                                            {repo.warnings.slice(0, 3).map((w: string, i: number) => (
                                                <span key={i} className="flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                                                    <AlertTriangle className="w-3 h-3" /> {w}
                                                </span>
                                            ))}
                                            {repo.warnings.length > 3 && <span className="flex items-center text-slate-500">+{repo.warnings.length - 3} more</span>}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 md:flex-col md:items-end md:justify-center">
                                    <Link href={`/repo/${repo.id}?user=${username}`} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700 whitespace-nowrap">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {filteredRepos.length === 0 && (
                            <div className="text-center text-slate-500 p-8">No repositories match your search.</div>
                        )}
                    </div>
                </div>

                {/* AI Recruiter & Roadmap */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="text-2xl">👔</span> AI Recruiter Simulation
                        </h3>

                        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl text-sm text-slate-300 mb-4 shadow-inner flex-grow">
                            <div className="flex items-center gap-2 mb-3 text-slate-400">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow">R</div>
                                <div>
                                    <div className="font-bold text-slate-200">Tech Recruiter at Google</div>
                                    <div className="text-xs">Just now</div>
                                </div>
                            </div>
                            <p className="italic mb-4">"{recruiterSummary}"</p>
                            <div className={`font-bold mb-4 ${recruiterDecision.includes('HIRE') || recruiterDecision.includes('MAYBE') ? 'text-emerald-400' : 'text-red-400'}`}>
                                🎯 Decision: {recruiterDecision}
                            </div>

                            <div className="font-bold text-slate-200 mb-2">❓ Probable Interview Questions:</div>
                            <ul className="list-decimal ml-5 space-y-1 text-slate-400">
                                {recruiterQuestions.map((q: string, i: number) => <li key={i}>{q}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Map className="w-5 h-5 text-emerald-400" /> Improvement Roadmap
                        </h3>

                        <div className="space-y-4 flex-grow">
                            <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-4">
                                <h4 className="font-bold text-red-400 text-sm mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500" /> URGENT (Next 7 Days)
                                </h4>
                                <div className="space-y-2 text-sm text-slate-300 list-none">
                                    {roadmapShort.slice(0, 3).map((task: any, i: number) => (
                                        <label key={i} className="flex items-start gap-2 cursor-pointer group">
                                            <input type="checkbox" className="mt-1 bg-slate-800 border-slate-600 rounded text-blue-500" />
                                            <span className="group-hover:text-slate-100 transition-colors">{task.goal || task.task || (typeof task === 'string' ? task : JSON.stringify(task))}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-xl p-4">
                                <h4 className="font-bold text-yellow-400 text-sm mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-yellow-500" /> SHORT TERM (30 Days)
                                </h4>
                                <div className="space-y-2 text-sm text-slate-300">
                                    {roadmapLong.slice(0, 3).map((task: any, i: number) => (
                                        <label key={i} className="flex items-start gap-2 cursor-pointer group">
                                            <input type="checkbox" className="mt-1 bg-slate-800 border-slate-600 rounded text-blue-500" />
                                            <span className="group-hover:text-slate-100 transition-colors">{task.goal || task.task || (typeof task === 'string' ? task : JSON.stringify(task))}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <Suspense fallback={<div className="flex h-64 items-center justify-center animate-pulse"><Loader2 className="w-8 h-8 animate-spin text-blue-500 mr-2" /> Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
