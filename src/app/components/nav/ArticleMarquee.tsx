"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  red_flags?: string | null;
  rugpull_score?: number | null;
  project_type?: string | null;
}

interface RawArticleData {
  id: string | number;
  title: string;
  red_flags?: string | null;
  rugpull_score?: number | null;
  project_type?: string | null;
  [key: string]: unknown;
}

function getAnimationDuration(count: number, isMobile: boolean): string {
  if (isMobile) {
    if (count > 5) return "40s";
    if (count > 3) return "30s";
    return "25s";
  }
  if (count > 5) return "120s";
  if (count > 3) return "90s";
  return "60s";
}

interface ArticleMarqueeProps {
  isMobile: boolean;
}

export function ArticleMarquee({ isMobile }: ArticleMarqueeProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const response = await fetch(
        "/api/all-articles?tableFilter=rugpull_context&skipRowCount=true",
      );
      const data = await response.json();

      if (data.success && data.tables?.length > 0) {
        const rugpullTable = data.tables.find((t: { name: string }) =>
          t.name.toLowerCase().includes("rugpull_context"),
        );

        if (rugpullTable?.sampleData) {
          const valid = rugpullTable.sampleData
            .filter((a: RawArticleData) => a.id && a.title)
            .map((a: RawArticleData): Article => ({
              id: String(a.id),
              title: String(a.title),
              red_flags: a.red_flags || null,
              rugpull_score: typeof a.rugpull_score === "number" ? a.rugpull_score : null,
              project_type: a.project_type || null,
            }))
            .slice(0, 10);
          setArticles(valid);
        } else {
          setFetchError("No article data available");
        }
      } else {
        setFetchError(data.error || "Failed to retrieve articles");
      }
    } catch {
      setFetchError("Network error while fetching articles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const duration = getAnimationDuration(articles.length, isMobile);

  return (
    <div className="border-b border-gray-700/30 overflow-hidden">
      <div
        className="whitespace-nowrap animate-scroll"
        style={{ animationDuration: duration }}
      >
        <div className="inline-flex items-center space-x-4 md:space-x-8 px-4 py-1 md:py-2 text-xs md:text-sm text-gray-300">
          {isLoading ? (
            <>
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#d6973e]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading latest articles...
              </span>
              <span>•</span>
            </>
          ) : fetchError ? (
            <>
              <span className="text-red-400">⚠️ {fetchError}</span>
              <span>•</span>
            </>
          ) : articles.length > 0 ? (
            articles.map((article, index) => (
              <React.Fragment key={article.id || index}>
                <Link
                  href={`/article/${article.id}`}
                  className={`group flex items-center cursor-pointer transition-colors ${hoveredId === article.id ? "text-[#d6973e]" : ""}`}
                  onMouseEnter={() => setHoveredId(article.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {article.rugpull_score && article.rugpull_score > 7 ? (
                    <span className="mr-1">🚨</span>
                  ) : article.red_flags ? (
                    <span className="mr-1">⚠️</span>
                  ) : article.project_type?.toLowerCase().includes("coin") ? (
                    <span className="mr-1">💰</span>
                  ) : article.project_type?.toLowerCase().includes("nft") ? (
                    <span className="mr-1">🖼️</span>
                  ) : (
                    <span className="mr-1">📰</span>
                  )}
                  <span className="group-hover:underline">
                    {article.title.length > 50
                      ? `${article.title.substring(0, 47)}...`
                      : article.title}
                  </span>
                </Link>
                {index < articles.length - 1 && <span>•</span>}
              </React.Fragment>
            ))
          ) : (
            <>
              <span>🚨 BREAKING: New DeFi protocol exploited for $12M</span>
              <span>•</span>
              <span>⚠️ Pi Network under investigation by SEC</span>
              <span>•</span>
              <span>📊 Rug pulls up 340% this quarter</span>
              <span>•</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
