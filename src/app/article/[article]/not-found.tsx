import Link from "next/link";
import Image from "next/image";
import { RiArrowLeftLine, RiErrorWarningLine } from "react-icons/ri";

interface Article {
  id: number;
  creator: string;
  title: string;
  link: string;
  isodate: string;
  contentsnippet: string;
  banner_image?: string;
  risk_level?: string;
}

async function getRelatedArticles() {
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
      return data.tables[0].sampleData.slice(0, 9);
    }
    return [];
  } catch (err) {
    console.error("Error fetching related articles:", err);
    return [];
  }
}

const getRiskLevelClass = (level?: string): string => {
  if (!level) return "text-gray-200 bg-gray-800/50 border border-gray-500/30";

  const levelUpper = level.toUpperCase();

  if (levelUpper.includes("HIGH")) {
    return "text-red-300 bg-red-900/20 border border-red-500/30";
  } else if (levelUpper.includes("MEDIUM")) {
    return "text-yellow-300 bg-yellow-900/20 border border-yellow-500/30";
  } else if (levelUpper.includes("LOW")) {
    return "text-green-300 bg-green-900/20 border border-green-500/30";
  }

  return "text-gray-200 bg-gray-800/50 border border-gray-500/30";
};

const formatDate = (isoDate: string) => {
  try {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    console.log(e);
    return "Unknown Date";
  }
};

export default async function ArticleNotFound() {
  const relatedArticles = await getRelatedArticles();

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Compact Error Message */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-[#d6973e] font-subtitle hover:text-[#d6973e]/80 text-base font-medium mb-4 inline-flex items-center transition-colors duration-300"
          >
            <RiArrowLeftLine className="mr-1" /> Back to Articles
          </Link>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mt-4">
            <div className="flex items-start gap-4">
              <RiErrorWarningLine className="text-red-400 text-3xl flex-shrink-0 mt-1" />
              <div>
                <h1 className="text-xl font-bold font-title text-white mb-2">
                  Article Not Found
                </h1>
                <p className="text-sm text-gray-300">
                  The article you&apos;re looking for doesn&apos;t exist or may
                  have been removed. Check out our latest stories below.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-title border-b border-gray-700/50 pb-3 flex items-center">
              <span className="bg-[#d6973e] w-2 h-8 mr-3 rounded-sm"></span>
              Latest Stories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((article: Article) => (
                <Link
                  href={`/${article.id}`}
                  key={article.id}
                  className="block group"
                >
                  <div className="border border-gray-700/30 overflow-hidden transition-all duration-300 hover:bg-gray-500/10 hover:border-gray-500/30 h-full flex flex-col">
                    {article.banner_image && (
                      <div className="w-full h-48 relative flex-shrink-0">
                        <Image
                          src={article.banner_image}
                          alt={article.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="text-xs text-gray-400 truncate">
                          {article.creator || "ANON"} •{" "}
                          {formatDate(article.isodate)}
                        </div>
                        {article.risk_level && (
                          <div
                            className={`${getRiskLevelClass(article.risk_level)} text-xs px-2 py-1 rounded font-medium whitespace-nowrap`}
                          >
                            {article.risk_level}
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg font-title text-white group-hover:text-[#d6973e] transition-colors duration-300 mb-3 line-clamp-2 leading-tight">
                        {article.title}
                      </h3>
                      <p className="text-sm font-subtitle text-gray-300 line-clamp-3 leading-relaxed flex-grow">
                        {article.contentsnippet}
                      </p>
                      <div className="mt-4 pt-3 border-t border-gray-700/30">
                        <span className="text-sm text-[#d6973e] group-hover:text-[#d68b36] font-medium transition-colors duration-300">
                          Read Analysis →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Fallback if no articles */}
        {relatedArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-6">
              No articles available at the moment.
            </p>
            <Link
              href="/"
              className="inline-flex items-center bg-[#d6973e] hover:bg-[#d68b36] text-white font-medium font-subtitle px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Go to Homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
