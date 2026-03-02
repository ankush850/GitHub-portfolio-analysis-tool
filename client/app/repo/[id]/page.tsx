"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  GitFork,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Code,
  Loader2,
} from "lucide-react";

export default function RepoDetailWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <RepoDetail />
    </Suspense>
  );
}

function RepoDetail() {
  const params = useParams();
  const searchParams = useSearchParams();

  const repoName = params.id as string;
  const username = searchParams.get("user") || "octocat";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://github-portfolio-backend.onrender.com";

  useEffect(() => {
    async function fetchRepo() {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/v1/analyze/${username}/${repoName}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch repository analysis");
        }

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRepo();
  }, [username, repoName, API_URL]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-20">
        <AlertTriangle className="mx-auto mb-4" size={40} />
        <p>{error}</p>

        <Link
          href={`/dashboard?username=${username}`}
          className="mt-6 inline-block text-blue-400"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const repo = data?.analysis;
  if (!repo) return null;

  return (
    <div className="max-w-4xl mx-auto pt-6 space-y-6">
      <Link
        href={`/dashboard?username=${username}`}
        className="flex items-center gap-2 text-gray-400 hover:text-white"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="p-8 rounded-2xl border border-slate-800">
        <div className="flex justify-between flex-wrap gap-6">
          <div>
            <h1 className="text-3xl font-bold flex gap-2 items-center">
              <FileText />
              {repo.name}
            </h1>

            <p className="text-slate-400 mt-2">
              {repo.description || "No description"}
            </p>

            <div className="flex gap-6 mt-4">
              <span className="flex gap-1 items-center">
                <Star size={16} /> {repo.stars}
              </span>

              <span className="flex gap-1 items-center">
                <GitFork size={16} /> {repo.forks}
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-400">Live Score</p>
            <p className="text-5xl font-black">
              {repo.score?.overall || 0}
            </p>
            <p>Grade {repo.score?.grade || "F"}</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Metric
            title="Documentation"
            value={repo.score?.documentation}
          />
          <Metric
            title="Code Quality"
            value={repo.score?.code_quality}
          />
          <Metric title="Activity" value={repo.score?.activity} />
        </div>
      </div>
    </div>
  );
}

function Metric({ title, value }: any) {
  return (
    <div className="border border-slate-800 p-5 rounded-xl">
      <p className="text-slate-400">{title}</p>
      <p className="text-xl font-bold">{value || 0}/100</p>
    </div>
  );
}
