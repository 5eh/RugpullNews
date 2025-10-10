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

async function getSuggestedArticles() {
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
      return data.tables[0].sampleData.slice(0, 3);
    }
    return [];
  } catch (err) {
    console.error("Error fetching suggested articles:", err);
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

export default async function NotFound() {
  const suggestedArticles = await getSuggestedArticles();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        <div className=" p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#d6973e]/10 border border-[#d6973e]/30 rounded-full p-6">
              <RiErrorWarningLine className="text-[#d6973e] text-5xl md:text-6xl" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold font-subtitle text-white mb-4">
            Not Found
          </h2>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto">
            The article you&apos;re looking for doesn&apos;t exist or may have
            been removed. Let&apos;s get you back on track.
          </p>

          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center bg-[#d6973e] hover:bg-[#d68b36] text-white font-medium font-subtitle px-8 py-3 rounded-lg transition-colors duration-300"
            >
              <RiArrowLeftLine className="mr-2 text-xl" />
              Back to Home
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-700/30">
            <p className="text-sm text-gray-400">
              Looking for something specific?{" "}
              <Link
                href="/"
                className="text-[#d6973e] hover:text-[#d68b36] transition-colors duration-300 font-medium"
              >
                Browse all articles
              </Link>
            </p>
          </div>
        </div>

        {/* Suggested Stories */}
        {suggestedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 font-title border-b border-gray-700/50 pb-3 flex items-center">
              <span className="bg-[#d6973e] w-2 h-6 mr-3 rounded-sm"></span>
              You Might Be Interested In
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestedArticles.map((article: Article) => (
                <Link
                  href={`/${article.id}`}
                  key={article.id}
                  className="block group"
                >
                  <div className="border border-gray-700/30 overflow-hidden transition-all duration-300 hover:bg-gray-500/10 hover:border-gray-500/30 h-full">
                    {article.banner_image && (
                      <div className="w-full h-40 relative">
                        <Image
                          src={article.banner_image}
                          alt={article.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="text-xs text-gray-400 truncate">
                          {article.creator || "ANON"}
                        </div>
                        {article.risk_level && (
                          <div
                            className={`${getRiskLevelClass(article.risk_level)} text-xs px-2 py-1 rounded font-medium whitespace-nowrap`}
                          >
                            {article.risk_level}
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-base text-white group-hover:text-[#d6973e] transition-colors duration-300 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {article.contentsnippet}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
