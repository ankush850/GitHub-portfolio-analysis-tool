"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle2, Circle } from 'lucide-react';

function LoadingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams.get('username') || 'octocat';
    const [progress, setProgress] = useState(0);

    const steps = [
        { title: "Fetching profile data...", percent: 20 },
        { title: "Analyzing repositories...", percent: 45 },
        { title: "Checking README files...", percent: 65 },
        { title: "Evaluating commit history...", percent: 85 },
        { title: "Calculating final scores...", percent: 100 }
    ];

    const currentStepIndex = steps.findIndex(s => s.percent >= progress && s.percent < (progress + 25)) || 0;

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(() => router.push(`/dashboard?username=${encodeURIComponent(username)}`), 500);
                    return 100;
                }
                return p + 2;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [router, username]);

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center pt-8 animate-fade-in">
            <div className="w-full mb-12">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
            </div>

            <div className="glass-panel w-full rounded-3xl p-8 md:p-12 relative overflow-hidden border border-blue-500/20 shadow-2xl shadow-blue-900/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

                <h2 className="text-3xl font-bold mb-8 flex items-center justify-center gap-4 text-white">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    Analyzing GitHub Profile
                </h2>

                <div className="bg-slate-900/50 rounded-xl p-4 mb-8 text-center font-mono border border-slate-800">
                    github.com/<span className="text-blue-400 font-bold">{username}</span>
                </div>

                <p className="text-center text-slate-400 mb-6 font-medium">
                    ⏳ Please wait while we analyze... (≈ 2 minutes)
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-4 shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 transition-all duration-300 ease-out flex items-center justify-end pr-2"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                </div>
                <div className="text-right text-sm text-blue-400 font-bold mb-10">
                    {progress}% Complete
                </div>

                {/* Status Tracker */}
                <div className="space-y-4 mb-12">
                    <h3 className="font-bold text-slate-300 uppercase tracking-widest text-sm mb-4">📋 Current Status</h3>
                    {steps.map((step, i) => {
                        const isCompleted = progress >= step.percent;
                        const isActive = progress < step.percent && (i === 0 || progress >= steps[i - 1].percent);

                        return (
                            <div key={i} className={`flex items-center gap-4 text-sm font-medium transition-colors duration-500
                ${isCompleted ? 'text-emerald-400' : isActive ? 'text-white' : 'text-slate-600'}`}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : isActive ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                ) : (
                                    <Circle className="w-5 h-5" />
                                )}
                                {step.title}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function LoadingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoadingContent />
        </Suspense>
    );
}
