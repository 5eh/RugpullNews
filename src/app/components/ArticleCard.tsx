"use client";

import Image from "next/image";
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

// Format date function
const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get risk level class
const getRiskLevelClass = (level?: string): string => {
  if (!level)
    return "text-gray-200 bg-gray-700/80 text-xs px-2 py-1 rounded font-medium";

  const levelUpper = level.toUpperCase();

  if (levelUpper.includes("HIGH")) {
    return "text-red-100 bg-red-800/80 text-xs px-2 py-1 rounded font-medium";
  } else if (levelUpper.includes("MEDIUM")) {
    return "text-yellow-100 bg-yellow-700/80 text-xs px-2 py-1 rounded font-medium";
  } else if (levelUpper.includes("LOW")) {
    return "text-green-100 bg-green-800/80 text-xs px-2 py-1 rounded font-medium";
  }

  return "text-gray-200 bg-gray-700/80 text-xs px-2 py-1 rounded font-medium";
};

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  doubleHeight?: boolean;
  className?: string;
}

export default function ArticleCard({
  article,
  featured = false,
  doubleHeight = false,
  className = "",
}: ArticleCardProps) {
  const handleOriginalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Link href={`/${article.id}`} className="block h-full">
      <div
        className={`group h-full flex flex-col grayscale hover:grayscale-0 transition-all duration-300 hover:bg-gray-600/20 rounded-t-md overflow-hidden border border-gray-700/30 ${className}`}
      >
        <div
          className={`${
            featured
              ? "h-72 sm:h-96"
              : doubleHeight
                ? "h-96 sm:h-[28rem]"
                : "h-96"
          } w-full overflow-hidden relative`}
        >
          <Image
            src={
              article.banner_image ||
              `https://www.ccn.com/wp-content/uploads/2025/03/pi-network-pi-clings-to-1-support-but-faces-pressure-ahead-of-mainnet-migration-deadline.webp`
            }
            alt={article.title}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 66vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="transition-all duration-300 w-full h-full"
          />
        </div>

        <div className={`p-4 space-y-2 flex-1`}>
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-gray-400 tracking-wide">
              {article.creator || "ANON"} • {formatDate(article.isodate)}
            </div>
            {article.risk_level && (
              <div className={getRiskLevelClass(article.risk_level)}>
                {article.risk_level}
              </div>
            )}
          </div>
          <h3
            className={`${
              featured ? "text-3xl" : "text-xl"
            } font-bold font-title text-white leading-tight group-hover:text-[#d6973e] transition-colors duration-300`}
          >
            {article.title}
          </h3>

          <p className="text-lg font-subtitle text-gray-300 leading-relaxed line-clamp-4">
            {article.contentsnippet}
          </p>

          <div className="flex font-content gap-4 pt-2">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleOriginalLinkClick}
              className="text-xl text-gray-400 hover:text-gray-200 transition-colors duration-300"
            >
              Original
            </a>
            <span className="text-2xl font-title text-[#d6973e] hover:text-[#d68b36] transition-colors duration-300 font-medium">
              Our Report
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
