"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Github, LayoutDashboard, Target, Map, Award, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/loading?username=${encodeURIComponent(username)}`);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-24 py-12 animate-fade-in relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center w-full max-w-4xl z-10 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <Star className="w-4 h-4" /> Trusted by 10 developers
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">GitHub Profile</span>
          <br /> into a Recruiter-Ready Portfolio
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl font-light">
          Get actionable insights, score your repositories, and discover exactly what recruiters are looking for. Average score improvement: 35%
        </p>

        <form onSubmit={handleAnalyze} className="relative w-full max-w-xl flex items-center shadow-2xl shadow-blue-900/20 rounded-full focus-within:ring-4 focus-within:ring-blue-500/20 transition-all">
          <div className="absolute left-6 text-slate-400 flex items-center gap-2 pointer-events-none">
            <Github className="w-5 h-5" />
            <span className="text-slate-500 font-mono hidden sm:inline">github.com/</span>
          </div>
          <input
            type="text"
            placeholder="Enter Username"
            className="w-full h-16 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-full pl-14 sm:pl-40 pr-36 focus:outline-none focus:border-blue-500/50 text-white font-mono placeholder:text-slate-600 transition-colors"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold flex items-center gap-2 px-6 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            <Search className="w-4 h-4" /> Analyze
          </button>
        </form>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="w-full max-w-5xl z-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-blue-400" /> How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
          {[
            { num: "1️⃣", title: "Enter Username", desc: "Just drop in your GitHub handle" },
            { num: "2️⃣", title: "AI Analysis", desc: "We scan all your public repos" },
            { num: "3️⃣", title: "Get Score", desc: "Receive a grade from 0 to 100" },
            { num: "4️⃣", title: "Improve", desc: "Follow the custom roadmap" }
          ].map((step, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center relative group hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:shadow-blue-900/20">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">{step.num}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
              <p className="text-slate-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full max-w-5xl z-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-12">⭐ Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {[
            { icon: <Award className="w-6 h-6 text-yellow-400" />, title: "Portfolio Score", desc: "Get scored 0-100 on 5 key metrics including documentation, code quality, and impact." },
            { icon: <Search className="w-6 h-6 text-purple-400" />, title: "AI Recruiter Simulator", desc: "Real feedback mimicking a top-tier tech recruiter's perspective on your profile." },
            { icon: <Target className="w-6 h-6 text-red-400" />, title: "Red Flags Detection", desc: "Find exactly what's wrong: missing READMEs, inactive periods, and code smells." },
            { icon: <Map className="w-6 h-6 text-emerald-400" />, title: "Roadmap Generator", desc: "Personalized 7/30/90 day action plan to get your portfolio into top 1% shape." }
          ].map((f, i) => (
            <div key={i} className="glass-panel p-8 rounded-2xl flex items-start gap-4 hover:bg-slate-800/50 transition-colors border border-slate-700/50 hover:border-blue-500/30">
              <div className="p-3 bg-slate-900 rounded-xl shadow-inner border border-slate-800">{f.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
