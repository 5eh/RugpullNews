import { Suspense } from "react";
import Loading from "./components/loading";
import Image from "next/image";

interface Article {
  id: number;
  creator: string;
  title: string;
  link: string;
  pubdate: string;
  content: string;
  contentsnippet: string;
  guid: string;
  isodate: string;
  banner_image?: string;
  risk_level?: string;
  rugpull_score?: number;
}

type ArticleResponse = {
  success: boolean;
  tables: Array<{
    sampleData: Article[];
  }>;
};

async function getArticles(): Promise<{
  articles: Article[];
  error: string | null;
}> {
  try {
    // In development, use localhost, otherwise use production URL
    const isLocalDev = process.env.NODE_ENV === "development";
    const apiUrl = isLocalDev
      ? "http://localhost:3000/api/all-articles?tableFilter=rugpull_context"
      : "https://rugpullnews.org/api/all-articles?tableFilter=rugpull_context";

    console.log("Fetching articles from:", apiUrl);

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    try {
      const data = (await response.json()) as ArticleResponse;

      if (data.success && data.tables && data.tables[0]?.sampleData) {
        return { articles: data.tables[0].sampleData, error: null };
      } else {
        console.warn("API returned success=false or missing data:", data);
        return { articles: [], error: "No articles found in API response" };
      }
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      return {
        articles: [],
        error: "Failed to parse API response data",
      };
    }
  } catch (err) {
    console.error("Error fetching articles:", err);
    return {
      articles: [],
      error: "Failed to fetch articles. Please try again later.",
    };
  }
}

export default async function Home() {
  const { articles, error } = await getArticles();

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        }
      >
        {error && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-md p-4 mb-6">
            <div className="text-red-400">
              <h3 className="font-medium">Error Loading Articles</h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {articles.map((article) => (
          <div
            key={article.id}
            className="group cursor-pointer grayscale hover:grayscale-0 transition-all duration-300 border-b border-gray-700/30 pb-6"
          >
            {/* Article Image */}
            <div className="aspect-video bg-gray-700/40 overflow-hidden rounded-sm mb-4 relative">
              <Image
                src={
                  article.banner_image ||
                  `https://www.ccn.com/wp-content/uploads/2025/03/pi-network-pi-clings-to-1-support-but-faces-pressure-ahead-of-mainnet-migration-deadline.webp`
                }
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                style={{ objectFit: "cover" }}
                className="transition-all duration-300"
              />
            </div>

            <div className="space-y-3">
              <div className="text-xs text-gray-400  tracking-wide">
                {article.creator || "ANON"} • {formatDate(article.isodate)}
              </div>
              <h3 className="text-lg font-title text-white leading-tight group-hover:text-[#d6973e] transition-colors duration-300">
                {article.title}
              </h3>

              {/* Description */}
              <p className="text-sm font-subtitle text-gray-300 leading-relaxed">
                {article.contentsnippet}
              </p>

              {/* Action Buttons */}
              <div className="flex font-content gap-4 pt-2">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors duration-300"
                >
                  Original Article
                </a>
                <a
                  href={`/${article.id}`}
                  className="text-sm font-title text-[#d6973e] hover:text-[#d68b36] transition-colors duration-300 font-medium"
                >
                  Our Report
                </a>
              </div>
            </div>
          </div>
        ))}
      </Suspense>
    </div>
  );
}
