import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import { RiExternalLinkLine, RiArrowLeftLine } from "react-icons/ri";
import ReportButton from "@/app/components/ReportButton";
import { Article } from "@/app/lib/types";
import { parseRedFlags, getRiskColor } from "@/app/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rugpullnews.org";

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
  bannerImage?: string | null;
  contentSnippet?: string;
}

interface ArticlePageProps {
  params: Promise<{
    article: string;
  }>;
}

const getArticleData = cache(async function getArticleData(
  id: string,
): Promise<ProcessedArticleData | null> {
  try {
    const isLocalDev = process.env.NODE_ENV === "development";
    const apiUrl = isLocalDev
      ? `http://localhost:3000/api/get-article?id=${id}`
      : `https://rugpullnews.org/api/get-article?id=${id}`;

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.article) {
      return null;
    }

    const rawArticle: Article = data.article;

    const redFlags = parseRedFlags(rawArticle.red_flags);

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
    return null;
  }
});

function formatDate(isoDate: string) {
  try {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Unknown Date";
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getArticleData(resolvedParams.article);

  if (!data) {
    return { title: "Article Not Found | Rugpull News" };
  }

  const description = data.contentSnippet || data.analysis.slice(0, 160);
  const ogImage = data.bannerImage || `${SITE_URL}/images/article-fallback.png`;

  return {
    title: `${data.title} | Rugpull News`,
    description,
    openGraph: {
      title: data.title,
      description,
      type: "article",
      url: `${SITE_URL}/article/${data.id}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: data.title }],
      publishedTime: data.publishDate,
      authors: [data.creator],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const articleId = resolvedParams.article;

  const articleData = await getArticleData(articleId);

  if (!articleData) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: articleData.title,
    description: articleData.contentSnippet || articleData.analysis.slice(0, 160),
    datePublished: articleData.publishDate,
    author: { "@type": "Person", name: articleData.creator },
    publisher: {
      "@type": "Organization",
      name: "Rugpull News",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/article-fallback.png` },
    },
    image: articleData.bannerImage || `${SITE_URL}/images/article-fallback.png`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/article/${articleData.id}` },
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
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
                <div
                  className={`text-4xl md:text-5xl font-bold mb-4 ${
                    articleData.rugPullScore <= 25
                      ? "text-green-400"
                      : articleData.rugPullScore <= 60
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  {articleData.rugPullScore}/100
                </div>
                <div className="text-base md:text-lg text-gray-300">
                  Based on our analysis
                </div>
              </div>

              <div className="mt-6 bg-gray-700/50 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    articleData.rugPullScore <= 25
                      ? "bg-green-400"
                      : articleData.rugPullScore <= 60
                        ? "bg-yellow-400"
                        : "bg-red-400"
                  }`}
                  style={{ width: `${Math.min(articleData.rugPullScore, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Red Flags */}
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

        {/* Disclaimer */}
        <div className="mt-10 bg-yellow-900/30 rounded-lg p-4 md:p-6 max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="text-xs md:text-sm text-yellow-200">
              <strong>Disclaimer:</strong> This analysis is for informational
              purposes only and should not be considered financial advice. Always
              conduct your own research before making investment decisions.
            </div>
          </div>
        </div>

        {/* Report Button */}
        <div className="mt-4 max-w-6xl mx-auto">
          <ReportButton articleId={Number(articleId)} />
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

interface RelatedArticle {
  id: number | string;
  title: string;
  isodate: string;
  banner_image?: string | null;
  risk_level?: string | null;
  creator?: string;
  link?: string;
}

async function RelatedArticles({
  currentArticleId,
}: {
  currentArticleId: string;
}) {
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
      console.error("Error fetching related articles:", err);
      return {
        articles: [],
        error: "Failed to fetch articles. Please try again later.",
      };
    }
  }

  const { articles, error } = await getArticles();

  const filteredArticles = articles.filter(
    (article: RelatedArticle) => article.id.toString() !== currentArticleId,
  );

  const textArticles = filteredArticles.slice(0, 3);
  const imageArticles = filteredArticles.slice(3, 6);

  if (error || filteredArticles.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 pr-4 border-r border-gray-700/30">
        <ul className="space-y-4">
          {textArticles.map((article: RelatedArticle) => (
            <li
              key={`title-${article.id}`}
              className="border-b border-gray-700/20 pb-3"
            >
              <Link href={`/article/${article.id}`} className="group">
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

      <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {imageArticles.map((article: RelatedArticle) => (
          <Link
            href={`/article/${article.id}`}
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
                    className="grayscale-[70%] group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              )}
              <div className="p-3">
                <h3 className="font-medium text-white group-hover:text-[#d6973e] transition-colors text-sm">
                  {article.title}
                </h3>
                {article.risk_level && (
                  <div
                    className="mt-2 inline-block text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap"
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
