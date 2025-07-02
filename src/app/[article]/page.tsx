/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { RiExternalLinkLine, RiArrowLeftLine } from "react-icons/ri";

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

// Type for articles in the related articles section
interface RelatedArticle {
  id: number | string;
  title: string;
  isodate: string;
  banner_image?: string;
  risk_level?: string;
  creator?: string;
  link?: string;
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
            <div
              className={`mb-4 py-1 px-3 rounded-sm font-subtitle text-sm font-medium inline-flex items-center whitespace-nowrap ${getRiskColor(articleData.riskLevel)}`}
            >
              {articleData.riskLevel}
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-title text-white mb-4 leading-tight max-w-4xl">
            {articleData.title
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h1>

          {/* Article Summary moved to top */}
          <p className="text-gray-300 text-base md:text-lg leading-relaxed w-full mb-6">
            {articleData.contentSnippet}
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {/* Main Content */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6">
                Our Analysis
              </h2>
              <div className="text-gray-300 leading-relaxed mb-4 text-base md:text-lg whitespace-pre-line max-w-prose">
                {articleData.analysis}
              </div>
              <div className="text-lg text-gray-300 font-title mb-4 py-2 text-left border-t border-gray-700/30 pt-4 mt-4">
                {articleData.creator} • {formatDate(articleData.publishDate)}
              </div>
            </div>
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

            {/* Red Flags - Moved to sidebar */}
            {articleData.redFlags && articleData.redFlags.length > 0 && (
              <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6 flex items-center">
                  <span className="text-red-400 mr-2">🚩</span> Red Flags
                  Identified
                </h3>
                <ol className="space-y-3 md:space-y-4 list-decimal pl-5">
                  {articleData.redFlags.map((flag, index) => (
                    <li
                      key={index}
                      className="text-gray-300 text-sm md:text-base pl-2"
                    >
                      {flag}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer - Moved to bottom */}
        <div className="mt-10 bg-yellow-900/30 rounded-lg p-4 md:p-6 max-w-6xl mx-auto">
          <div className="text-xs md:text-sm text-yellow-200">
            <strong>Disclaimer:</strong> This analysis is for informational
            purposes only and should not be considered financial advice. Always
            conduct your own research before making investment decisions.
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-10 max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-title border-b border-gray-700/50 pb-3 flex items-center">
            <span className="bg-[#d6973e] w-2 h-6 mr-3 rounded-sm"></span>
            More Stories
          </h2>

          <RelatedArticles currentArticleId={articleId} />
        </div>
      </div>
    </div>
  );
}

// Component to fetch and display related articles
async function RelatedArticles({
  currentArticleId,
}: {
  currentArticleId: string;
}) {
  // Reuse the same API call as in the main page
  async function getArticles() {
    try {
      const isLocalDev = process.env.NODE_ENV === "development";
      const apiUrl = isLocalDev
        ? "http://localhost:3000/api/all-articles?tableFilter=rugpull_context"
        : "https://rugpullnews.org/api/all-articles?tableFilter=rugpull_context";

      const response = await fetch(apiUrl, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (data.success && data.tables && data.tables[0]?.sampleData) {
        return { articles: data.tables[0].sampleData, error: null };
      } else {
        return { articles: [], error: "No articles found in API response" };
      }
    } catch (err) {
      console.log(err);
      return {
        articles: [],
        error: "Failed to fetch articles. Please try again later.",
      };
    }
  }

  const { articles, error } = await getArticles();

  // Filter out current article and get enough for both sides
  const filteredArticles = articles.filter(
    (article: RelatedArticle) => article.id.toString() !== currentArticleId,
  );

  // Get up to 3 articles for text list on left
  const textArticles = filteredArticles.slice(0, 3);

  // Get up to 3 different articles for image cards on right
  const imageArticles = filteredArticles.slice(3, 6);

  if (error || filteredArticles.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left side: Article titles */}
      <div className="w-full md:w-1/3 pr-4 border-r border-gray-700/30">
        <ul className="space-y-4">
          {textArticles.map((article: RelatedArticle) => (
            <li
              key={`title-${article.id}`}
              className="border-b border-gray-700/20 pb-3"
            >
              <Link href={`/${article.id}`} className="group">
                <h3 className="font-medium text-white group-hover:text-[#d6973e] transition-colors text-base">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(article.isodate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side: Article cards with images */}
      <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {imageArticles.map((article: RelatedArticle) => (
          <Link
            href={`/${article.id}`}
            key={`card-${article.id}`}
            className="block group"
          >
            <div className="border border-gray-700/30 overflow-hidden transition-all duration-300 hover:bg-gray-500/10 hover:border-gray-500/30 h-full">
              {article.banner_image && (
                <div className="w-full h-32 relative">
                  <Image
                    src={article.banner_image}
                    alt={article.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="p-3">
                <h3 className="font-medium text-white group-hover:text-[#d6973e] transition-colors text-sm">
                  {article.title}
                </h3>
                {article.risk_level && (
                  <div
                    className="mt-2 inline-block text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap bg-opacity-20"
                    style={{
                      color: article.risk_level.toUpperCase().includes("HIGH")
                        ? "#FCA5A5"
                        : article.risk_level.toUpperCase().includes("MEDIUM")
                          ? "#FCD34D"
                          : article.risk_level.toUpperCase().includes("LOW")
                            ? "#86EFAC"
                            : "#E5E7EB",
                      border: "1px solid",
                      borderColor: article.risk_level
                        .toUpperCase()
                        .includes("HIGH")
                        ? "rgba(220, 38, 38, 0.3)"
                        : article.risk_level.toUpperCase().includes("MEDIUM")
                          ? "rgba(245, 158, 11, 0.3)"
                          : article.risk_level.toUpperCase().includes("LOW")
                            ? "rgba(16, 185, 129, 0.3)"
                            : "rgba(156, 163, 175, 0.3)",
                      backgroundColor: article.risk_level
                        .toUpperCase()
                        .includes("HIGH")
                        ? "rgba(220, 38, 38, 0.1)"
                        : article.risk_level.toUpperCase().includes("MEDIUM")
                          ? "rgba(245, 158, 11, 0.1)"
                          : article.risk_level.toUpperCase().includes("LOW")
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(156, 163, 175, 0.1)",
                    }}
                  >
                    {article.risk_level}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
