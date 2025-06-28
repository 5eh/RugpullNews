"use client";

import Image from "next/image";
import Link from "next/link";
import { RiExternalLinkLine } from "react-icons/ri";

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

const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getRiskLevelClass = (level?: string): string => {
  if (!level)
    return "text-gray-200 border border-gray-500/30 text-xs px-2 py-1 rounded font-medium whitespace-nowrap";

  const levelUpper = level.toUpperCase();

  if (levelUpper.includes("HIGH")) {
    return "text-red-300 border border-red-500/30 text-xs px-2 py-1 rounded font-medium whitespace-nowrap";
  } else if (levelUpper.includes("MEDIUM")) {
    return "text-yellow-300 border border-yellow-500/30 text-xs px-2 py-1 rounded font-medium whitespace-nowrap";
  } else if (levelUpper.includes("LOW")) {
    return "text-green-300 border border-green-500/30 text-xs px-2 py-1 rounded font-medium whitespace-nowrap";
  }

  return "text-gray-200 border border-gray-500/30 text-xs px-2 py-1 rounded font-medium whitespace-nowrap";
};

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  doubleHeight?: boolean;
  className?: string;
}

export default function ArticleCard({
  article,
  featured,
  doubleHeight = false,
  className = "",
}: ArticleCardProps) {
  return (
    <div
      className={`group lg:blur-sm lg:hover:blur-none ease-in-out flex flex-col justify-between ${featured ? "!blur-none" : "lg:grayscale lg:hover:grayscale-0"} transition-all duration-300 hover:bg-gray-500/5 hover:border-gray-500/20 rounded-lg overflow-hidden border border-gray-700/30 ${className}`}
    >
      <Link href={`/${article.id}`} className="block">
        <div
          className={`${
            featured
              ? "h-44 sm:h-56 md:h-72 lg:h-96"
              : doubleHeight
                ? "h-36 sm:h-56 md:h-96 lg:h-[32rem]"
                : "h-32 sm:h-44 md:h-64"
          } w-full overflow-hidden relative group-hover:shadow-md transition-all`}
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
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="transition-all duration-300 w-full h-full hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-2 sm:p-4 flex flex-col flex-grow">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] sm:text-xs text-gray-400 tracking-wide truncate max-w-full font-medium">
              {article.creator || "ANON"}
              {(article.creator?.length || 0) <= 35 && (
                <span className="hidden md:inline">
                  {" "}
                  • {formatDate(article.isodate)}
                </span>
              )}
            </div>
            <div className="md:block hidden">
              {article.risk_level && (
                <div
                  className={`${getRiskLevelClass(article.risk_level)} filter-none`}
                  style={{ filter: "none" }}
                >
                  {article.risk_level}
                </div>
              )}
            </div>
          </div>

          <Link
            href={`/${article.id}`}
            className="group-hover:text-[#d6973e] transition-colors duration-300 block"
          >
            <h3
              className={`${
                featured
                  ? "text-sm sm:text-lg md:text-xl"
                  : "text-xs sm:text-sm md:text-base"
              } font-bold font-title hover:text-[#d6973e] hover:transition hover:ease-in-out duration-300 text-white leading-tight max-w-prose`}
            >
              {article.title}
            </h3>
          </Link>

          <p className="text-[10px] sm:text-xs md:text-sm font-subtitle text-gray-300 leading-relaxed line-clamp-2 sm:line-clamp-3 w-full tracking-wide">
            {article.contentsnippet}
          </p>
        </div>

        <div className="mt-auto pt-2">
          {/* Risk level indicator for mobile - above the border */}
          <div className="block sm:hidden mb-2">
            {article.risk_level && (
              <div
                className={`${getRiskLevelClass(article.risk_level)} filter-none text-[9px] px-1 py-0.5 inline-block`}
                style={{ filter: "none" }}
              >
                {article.risk_level}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-1 sm:gap-4 pt-1 sm:pt-2 border-t border-gray-700/30">
            <div className="flex items-center justify-start w-full sm:w-auto">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] sm:text-xs text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
              >
                Original <RiExternalLinkLine className="ml-1" />
              </a>
            </div>
            <Link
              href={`/${article.id}`}
              className="text-[10px] sm:text-xs font-title text-[#d6973e] hover:text-[#d68b36] transition-colors duration-300 font-medium sm:text-right text-left"
            >
              Our Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
