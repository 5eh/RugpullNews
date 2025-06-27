import { Suspense } from "react";
import Loading from "./components/loading";
import ArticleCard from "./components/ArticleCard";
import ArticleHintTooltip from "./components/ArticleHintTooltip";

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

  return (
    <main className="px-4 py-6 pb-24 md:pb-6 relative">
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
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-auto gap-4 md:gap-5">
            {/* Featured Article - Position 1 */}
            {articles.length > 0 && (
              <div className="col-span-full  md:col-span-2 md:row-span-2 mb-4 md:mb-0">
                <ArticleCard
                  article={articles[0]}
                  featured={true}
                  className=""
                />
              </div>
            )}

            {/* Position 2 */}
            {articles.length > 1 && (
              <div className="col-span-full  sm:col-span-1 md:col-span-1 md:col-start-1 md:row-start-3 md:row-span-2 mb-4 md:mb-0">
                <ArticleCard article={articles[1]} doubleHeight={true} />
              </div>
            )}

            {/* Position 3 */}
            {articles.length > 2 && (
              <div className="col-span-full sm:col-span-1 md:col-span-1 md:col-start-3 md:row-start-1 md:row-span-3 mb-4 md:mb-0">
                <ArticleCard article={articles[2]} doubleHeight={true} />
              </div>
            )}

            {/* Position 4 */}
            {articles.length > 3 && (
              <div className="col-span-full sm:col-span-1 md:col-span-1 md:col-start-2 md:row-start-3 md:row-span-2 mb-4 md:mb-0">
                <ArticleCard article={articles[3]} doubleHeight={true} />
              </div>
            )}

            {/* Position 5 */}
            {articles.length > 4 && (
              <div className="col-span-full sm:col-span-1 md:col-span-1 md:col-start-1 md:row-start-5 md:row-span-2 mb-4 md:mb-0">
                <ArticleCard article={articles[4]} doubleHeight={true} />
              </div>
            )}

            {/* Position 6 */}
            {articles.length > 5 && (
              <div className="col-span-full sm:col-span-1 md:col-span-1 md:col-start-2 md:row-start-5 md:row-span-2 mb-4 md:mb-0">
                <ArticleCard article={articles[5]} doubleHeight={true} />
              </div>
            )}

            {/* Position 7 */}
            {articles.length > 6 && (
              <div className="col-span-full sm:col-span-1 md:col-span-1 md:col-start-3 md:row-start-4 md:row-span-3 mb-4 md:mb-0">
                <ArticleCard article={articles[6]} doubleHeight={true} />
              </div>
            )}

            {/* Position 8 - Ad Space (Sticky) */}
            <div className="col-span-full md:col-span-1 md:col-start-4 md:row-start-1 md:row-span-6 mt-4 md:mt-0">
              <div className="md:sticky top-4 rounded-lg flex flex-col items-center justify-start p-4 border border-red-800/30 md:max-h-[calc(100vh-2rem)] overflow-hidden">
                <div className="text-center w-full">
                  <h3 className="text-red-300 font-bold mb-3 uppercase tracking-wider text-sm">
                    Looking to advertise?
                  </h3>

                  <p>
                    Send a message to team@rugpullnews.org to check rates and
                    lengths
                  </p>
                </div>
              </div>
            </div>

            {/* Loop through remaining articles in 3-column layout, skipping the ad column */}
            {articles.length > 7 && (
              <div className="col-span-full md:col-span-4 mt-8 pb-16 md:pb-0">
                <h2 className="text-xl font-bold text-white mb-6 font-title border-b border-gray-700/50 pb-2">
                  More Stories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {articles.slice(7).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      className="mb-4 md:mb-0 rounded-none"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {articles.length === 0 && !error && (
          <div className="border border-gray-700/30 rounded-lg p-8 text-center hover:bg-gray-600/20 mb-20 md:mb-0">
            <h2 className="text-xl font-medium text-gray-300">
              No articles available
            </h2>
            <p className="text-gray-400 mt-2">
              Check back soon for the latest news
            </p>
          </div>
        )}
      </Suspense>

      {/* Tooltip that explains the blurred article interaction */}
      <ArticleHintTooltip />
    </main>
  );
}
