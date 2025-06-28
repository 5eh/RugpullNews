/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Link from "next/link";
import React from "react";
import Image from "next/image";
import {
  RiExternalLinkLine,
  RiShareForwardLine,
  RiArrowLeftLine,
} from "react-icons/ri";

interface ArticleData {
  id: number;
  creator: string;
  title: string;
  link: string;
  isodate: string;
  content: string;
  contentsnippet: string;
  risk_level: string;
  rugpull_score: number;
  red_flags: string;
  our_analysis: string;
  summary_analysis: string;
  banner_image: string;
}

interface ProcessedArticleData {
  id: string;
  title: string;
  creator: string;
  publishDate: string;
  originalLink: string;
  content: string;
  riskLevel: string;
  rugPullScore: number;
  redFlags: string[];
  analysis: string;
  bannerImage?: string;
}

interface ArticlePageProps {
  params: Promise<{
    article: string;
  }>;
}

async function getArticleData(
  id: string,
): Promise<ProcessedArticleData | null> {
  try {
    const isLocalDev = process.env.NODE_ENV === "development";
    const apiUrl = isLocalDev
      ? `http://localhost:3000/api/get-article?id=${id}`
      : `https://rugpullnews.org/api/get-article?id=${id}`;

    console.log("Fetching article data from:", apiUrl);

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch article data: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error(
        "API returned non-JSON response:",
        text.substring(0, 500) + "...",
      );
      throw new Error(
        `API returned non-JSON response (${contentType || "unknown content type"})`,
      );
    }

    const data = await response.json();

    if (!data.success || !data.article) {
      console.warn("API returned success=false or missing article data:", data);
      throw new Error("Article data not found");
    }

    const rawArticle: ArticleData = data.article;

    // Parse red flags from string to array
    let redFlags = [];

    if (rawArticle.red_flags) {
      if (typeof rawArticle.red_flags === "string") {
        // Check if it's a JSON array string (starts with [ and ends with ])
        if (
          rawArticle.red_flags.trim().startsWith("[") &&
          rawArticle.red_flags.trim().endsWith("]")
        ) {
          try {
            // Try to parse it as JSON
            const parsedFlags = JSON.parse(rawArticle.red_flags);
            if (Array.isArray(parsedFlags)) {
              redFlags = parsedFlags;
            }
          } catch (e) {
            console.error("Failed to parse red_flags as JSON:", e);
            // Fallback to original parsing method
            redFlags = rawArticle.red_flags
              .split("\n")
              .filter((flag) => flag.trim().length > 0)
              .map((flag) => flag.replace(/^- /, "").trim());
          }
        } else {
          // Use the original newline splitting method for non-JSON strings
          redFlags = rawArticle.red_flags
            .split("\n")
            .filter((flag) => flag.trim().length > 0)
            .map((flag) => flag.replace(/^- /, "").trim());
        }
      } else if (Array.isArray(rawArticle.red_flags)) {
        // It's already an array
        redFlags = rawArticle.red_flags;
      }
    }

    return {
      id: rawArticle.id.toString(),
      title: rawArticle.title,
      creator: rawArticle.creator || "Unknown or Anon",
      publishDate: rawArticle.isodate,
      originalLink: rawArticle.link,
      content: rawArticle.content || rawArticle.contentsnippet || "",
      contentSnippet: rawArticle.contentsnippet || "",
      riskLevel: rawArticle.risk_level || "TBD",
      rugPullScore: rawArticle.rugpull_score || 0,
      redFlags,
      analysis: rawArticle.our_analysis || rawArticle.summary_analysis || "",
      bannerImage: rawArticle.banner_image,
    };
  } catch (err) {
    console.error("Error fetching article:", err);
    console.error(
      "Error details:",
      err instanceof Error ? err.message : String(err),
    );
    return null;
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const articleId = resolvedParams.article;

  const articleData = await getArticleData(articleId);
  const error = articleData ? null : "Failed to load article data";

  const formatDate = (isoDate: string) => {
    try {
      return new Date(isoDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.log(e);
      return "Unknown Date";
    }
  };

  const getRiskColor = (level: string = "") => {
    if (!level) return "text-gray-300";

    const riskLevel = level.toUpperCase();
    switch (riskLevel) {
      case "HIGH RISK":
      case "HIGH":
        return "text-red-300 border border-red-500/30";
      case "MEDIUM RISK":
      case "MEDIUM":
        return "text-yellow-300 border border-yellow-500/30";
      case "LOW RISK":
      case "LOW":
        return "text-green-300 border border-green-500/30";
      default:
        return "text-gray-300 border border-gray-500/30";
    }
  };

  if (!articleData) {
    return (
      <div className="min-h-screen">
        <div className=" max-w-6xl mx-auto px-8 py-12">
          <Link
            href="/"
            className="text-[#d6973e] hover:text-[#d6973e]/80 text-lg font-medium mb-6 inline-block transition-colors duration-300"
          >
            ← Back to Articles
          </Link>

          <div className="bg-red-900/30 rounded-lg p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">Error Loading Article</h1>
            <p>
              {error || "Failed to load article data. Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="w-full flex flex-col md:flex-row md:justify-between">
            <Link
              href={articleData.originalLink}
              className="text-[#d6973e] font-subtitle hover:text-[#d6973e]/80 text-lg font-medium mb-3 md:mb-6 inline-flex items-center transition-colors duration-300 order-1 md:order-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Original Source <RiExternalLinkLine className="ml-1" />
            </Link>

            <Link
              href="/"
              className="text-[#d6973e] font-subtitle hover:text-[#d6973e]/80 text-lg font-medium mb-6 inline-flex items-center transition-colors duration-300 order-2 md:order-1"
            >
              <RiArrowLeftLine className="mr-1" /> Back to Articles
            </Link>
          </div>

          {articleData.bannerImage && (
            <div className="w-full h-64 relative mb-6 rounded-lg overflow-hidden">
              <Image
                src={articleData.bannerImage}
                alt={articleData.title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          )}

          <div className="w-full justify-between flex flex-wrap md:flex-nowrap">
            <div className="text-lg text-gray-300 font-title mb-4 py-2 text-left">
              {articleData.creator} • {formatDate(articleData.publishDate)}
            </div>
            <div
              className={`mb-4 py-1 px-3 rounded-sm font-subtitle text-sm font-medium inline-flex items-center whitespace-nowrap ${getRiskColor(articleData.riskLevel)}`}
            >
              {articleData.riskLevel}
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-title text-white mb-6 leading-tight max-w-4xl">
            {articleData.title}
          </h1>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {/* Main Content */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6">
                Our Analysis
              </h2>
              <div className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg whitespace-pre-line max-w-prose">
                {articleData.analysis}
              </div>

              <div className="bg-gray-600/30 rounded-lg p-4 md:p-6">
                <h3 className="font-semibold text-white mb-3 md:mb-4 text-lg md:text-xl">
                  Article Summary
                </h3>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-prose">
                  {articleData.contentSnippet}
                </p>
              </div>
            </div>

            {/* Red Flags */}
            {articleData.redFlags && articleData.redFlags.length > 0 && (
              <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
                <h3 className="text-xl font-semibold text-white mb-4 md:mb-6 flex items-center">
                  <span className="text-red-400 mr-2">🚩</span> Red Flags
                  Identified
                </h3>
                <ol className="space-y-3 md:space-y-4 max-w-prose list-decimal pl-5">
                  {articleData.redFlags.map((flag, index) => (
                    <li
                      key={index}
                      className="text-gray-300 text-base md:text-lg pl-2"
                    >
                      {flag}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 md:space-y-8 sticky top-4">
            {/* Rug Pull Score */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Rug Pull Score
              </h3>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-400 mb-4">
                  {articleData.rugPullScore}/10
                </div>
                <div className="text-base md:text-lg text-gray-300">
                  Based on our analysis
                </div>
              </div>

              <div className="mt-6 bg-gray-700/50 rounded-full h-3">
                <div
                  className="bg-red-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${articleData.rugPullScore * 10}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Quick Actions
              </h3>
              <div className="space-y-3 md:space-y-4">
                <button className="w-full bg-[#05A8DC] hover:bg-[#0494C7]  text-gray-200 py-3 md:py-4 px-4 md:px-6 rounded-sm text-base md:text-lg font-medium transition-all duration-300 flex items-center justify-center">
                  <RiShareForwardLine className="mr-2 text-xl" /> Share Analysis
                </button>
                <button className="w-full bg-gray-600/40 border border-[#05A8DC] hover:bg-gray-500/60 text-gray-200 py-3 md:py-4 px-4 md:px-6 rounded-sm text-base md:text-lg font-medium transition-all duration-300">
                  Subscribe to Updates
                </button>
                <button className="w-full  bg-gray-600/40 hover:bg-gray-500/60 text-white py-3 md:py-4 px-4 md:px-6 rounded-sm text-base md:text-lg font-medium transition-all duration-300">
                  Report This Project
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-900/30 rounded-lg p-4 md:p-6">
              <div className="text-xs md:text-sm text-yellow-200">
                <strong>Disclaimer:</strong> This analysis is for informational
                purposes only and should not be considered financial advice.
                Always conduct your own research before making investment
                decisions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
