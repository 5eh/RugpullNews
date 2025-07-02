import { Suspense } from "react";
import Loading from "./components/loading";
import ArticleCard from "./components/ArticleCard";
import Link from "next/link";

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

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 relative overflow-hidden max-w-7xl mx-auto">
      <h1 className="sr-only">Rugpull News - Crypto Scam Analysis</h1>

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        }
      >
        {error && (
          <div className="p-4 mb-6">
            <div className="text-red-400">
              <Loading />
            </div>
          </div>
        )}

        {articles.length > 0 && (
          <div className="flex flex-col gap-10">
            {/* Top Section: 2/3 Featured Article + 1/3 Title Section */}
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
              {/* Featured Article - 2/3 width on desktop */}
              <div className="w-full md:w-2/3">
                {articles.length > 0 && (
                  <div className="bg-gradient-to-b from-gray-800/10 to-transparent p-0.5 rounded-lg shadow-lg">
                    <ArticleCard
                      article={articles[0]}
                      featured={true}
                      className="h-full shadow-lg"
                    />
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/3 border border-gray-700/30 p-5 lg:p-6 backdrop-blur-sm shadow-lg">
                <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 font-title border-b border-gray-700/50 pb-3 flex items-center">
                  <span className="bg-[#d6973e] w-1 h-6 mr-3 "></span>
                  Latest Headlines
                </h2>
                <div className="space-y-4">
                  {articles.slice(1, 6).map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/${article.id}`}
                      className="block group"
                    >
                      <div
                        className={`pb-3 ${index < articles.slice(1, 6).length - 1 ? "border-b border-gray-700/20" : ""}`}
                      >
                        <p className="text-xs text-gray-400 mb-1">
                          {new Date(article.isodate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <h3 className="font-medium text-white group-hover:text-[#d6973e] transition-colors">
                          {article.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Section: 3 Article Cards in a Row */}
            <div className="mt-2">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-6 font-title border-b border-gray-700/50 pb-3 flex items-center">
                <span className="bg-[#d6973e] w-1 h-6 mr-3"></span>
                Featured Reports
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {articles.length > 1 && (
                  <div className="bg-gradient-to-b from-gray-800/5 to-transparent p-0.5 ">
                    <ArticleCard
                      article={articles[1]}
                      className="h-full shadow-md"
                    />
                  </div>
                )}
                {articles.length > 2 && (
                  <div className="bg-gradient-to-b from-gray-800/5 to-transparent p-0.5 rounded-lg">
                    <ArticleCard
                      article={articles[2]}
                      className="h-full shadow-md"
                    />
                  </div>
                )}
                {articles.length > 3 && (
                  <div className="bg-gradient-to-b from-gray-800/5 to-transparent p-0.5 rounded-lg">
                    <ArticleCard
                      article={articles[3]}
                      className="h-full shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Ad Space */}
            <div className="mt-10 rounded-lg flex flex-col items-center justify-start p-8 border border-red-800/30 bg-red-950/10 backdrop-blur-sm shadow-lg">
              <div className="text-center w-full">
                <h3 className="text-red-300 font-bold mb-4 uppercase tracking-wider text-lg">
                  Looking to advertise?
                </h3>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Support quality reporting on crypto scams and reach our
                  engaged audience. Send a message to team@rugpullnews.org to
                  check rates and options.
                </p>
              </div>
            </div>

            {/* Additional Stories */}
            {articles.length > 4 && (
              <div className="mt-12 pb-16 md:pb-4">
                <h2 className="text-xl lg:text-2xl font-bold text-white mb-6 md:mb-8 font-title border-b border-gray-700/50 pb-3 flex items-center">
                  <span className="bg-[#d6973e] w-1 h-6 mr-3"></span>
                  More Stories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {articles.slice(4, 12).map((article) => (
                    <div
                      key={article.id}
                      className="bg-gradient-to-b from-gray-800/5 to-transparent p-0.5 rounded-lg"
                    >
                      <ArticleCard
                        article={article}
                        className="h-full shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {articles.length === 0 && !error && (
          <div className="border border-gray-700/30 rounded-lg p-10 text-center hover:bg-gray-600/20 mb-20 md:mb-0 shadow-lg backdrop-blur-sm">
            <h2 className="text-2xl font-medium text-gray-300 mb-3">
              No articles available
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              We&apos;re currently updating our content. Check back soon for the
              latest crypto security news and analyses.
            </p>
          </div>
        )}
      </Suspense>
    </main>
  );
}
