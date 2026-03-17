"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { SubmissionStatusResponse } from "@/app/lib/types";

const STAGES = [
  { key: "queued", label: "Queued" },
  { key: "onchain", label: "On-Chain Analysis" },
  { key: "community", label: "Community Scraping" },
  { key: "ai", label: "AI Investigation" },
  { key: "published", label: "Published" },
];

function getStageIndex(stage: string): number {
  const idx = STAGES.findIndex((s) => s.key === stage);
  return idx >= 0 ? idx : 0;
}

export default function SubmissionStatusPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;

  const [data, setData] = useState<SubmissionStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/submission-status?id=${submissionId}`);
      const json: SubmissionStatusResponse = await res.json();

      if (!json.success) {
        setError(json.error || "Submission not found");
        return;
      }

      setData(json);
      setError(null);

      // Auto-redirect on published
      if (json.status === "published" && json.article_id) {
        setTimeout(() => {
          router.push(`/article/${json.article_id}`);
        }, 1500);
      }

      // Auto-redirect on duplicate with existing article
      if (json.status === "duplicate" && json.article_id) {
        setTimeout(() => {
          router.push(`/article/${json.article_id}`);
        }, 1500);
      }
    } catch {
      setError("Failed to fetch status. Retrying...");
    }
  }, [submissionId, router]);

  useEffect(() => {
    fetchStatus();

    const interval = setInterval(() => {
      fetchStatus();
    }, 3000);

    // Stop polling after 5 minutes
    const timeout = setTimeout(() => clearInterval(interval), 300000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [fetchStatus]);

  const currentStageIndex = data?.stage ? getStageIndex(data.stage) : 0;
  const isFailed = data?.status === "failed";
  const isComplete = data?.status === "published" || data?.status === "duplicate";

  return (
    <div className="min-h-screen px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold font-title text-white mb-2">
            Investigation Status
          </h1>
          {data?.contract_address && (
            <p className="text-gray-400 font-mono text-sm break-all">
              {data.contract_address}
              {data.chain && data.chain !== "ethereum" && (
                <span className="ml-2 text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                  {data.chain.toUpperCase()}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Error state */}
        {error && !data && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-300 mb-4">{error}</p>
            <Link
              href="/submit-post"
              className="text-[#d6973e] hover:text-[#e5a84e] underline"
            >
              Submit a new investigation
            </Link>
          </div>
        )}

        {data && (
          <>
            {/* Progress bar */}
            <div className="bg-gray-900/50 border border-gray-700/30 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-400">
                  {isComplete
                    ? "Investigation complete"
                    : isFailed
                      ? "Investigation failed"
                      : "Investigating..."}
                </span>
                <span className="text-sm font-mono text-gray-500">
                  {data.progress ?? 0}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-800 rounded-full h-3 mb-6 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isFailed
                      ? "bg-red-500"
                      : isComplete
                        ? "bg-green-500"
                        : "bg-[#d6973e]"
                  }`}
                  style={{ width: `${data.progress ?? 0}%` }}
                />
              </div>

              {/* Stage indicators */}
              <div className="flex justify-between">
                {STAGES.map((stage, i) => {
                  const isActive = i === currentStageIndex && !isFailed && !isComplete;
                  const isDone = i < currentStageIndex || isComplete;

                  return (
                    <div
                      key={stage.key}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                          isDone
                            ? "bg-green-600 text-white"
                            : isActive
                              ? "bg-[#d6973e] text-white animate-pulse"
                              : "bg-gray-800 text-gray-500"
                        }`}
                      >
                        {isDone ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span
                        className={`text-xs text-center ${
                          isDone
                            ? "text-green-400"
                            : isActive
                              ? "text-[#d6973e]"
                              : "text-gray-600"
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status message */}
            {isComplete && (
              <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-6 text-center">
                <p className="text-green-300 text-lg font-bold mb-2">
                  Investigation Published
                </p>
                <p className="text-gray-400 mb-4">
                  Redirecting to the investigation article...
                </p>
                {data.article_id && (
                  <Link
                    href={`/article/${data.article_id}`}
                    className="inline-block px-6 py-3 bg-green-700 hover:bg-green-600 rounded text-white font-medium transition-colors"
                  >
                    View Investigation
                  </Link>
                )}
              </div>
            )}

            {isFailed && (
              <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-6 text-center">
                <p className="text-red-300 text-lg font-bold mb-2">
                  Investigation Failed
                </p>
                {data.error && (
                  <p className="text-gray-400 text-sm mb-4 font-mono">
                    {data.error}
                  </p>
                )}
                <Link
                  href="/submit-post"
                  className="inline-block px-6 py-3 bg-[#d6973e] hover:bg-[#c4872e] rounded text-white font-medium transition-colors"
                >
                  Try Again
                </Link>
              </div>
            )}

            {!isComplete && !isFailed && (
              <div className="bg-gray-900/30 border border-gray-700/30 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <svg className="animate-spin h-5 w-5 text-[#d6973e] mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-gray-300">
                    {data.stage === "queued" && "Waiting in queue..."}
                    {data.stage === "onchain" && "Analyzing on-chain data..."}
                    {data.stage === "community" && "Scraping community sentiment..."}
                    {data.stage === "ai" && "Generating investigation report..."}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  This page updates automatically. Typical investigation takes 1-2 minutes.
                </p>
              </div>
            )}
          </>
        )}

        {/* Loading state */}
        {!data && !error && (
          <div className="text-center py-12">
            <svg className="animate-spin h-8 w-8 text-[#d6973e] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-400">Loading status...</p>
          </div>
        )}
      </div>
    </div>
  );
}
