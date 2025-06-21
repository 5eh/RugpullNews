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
    return "text-gray-200 border border-gray-500/30 text-xs px-2 py-1 rounded font-medium";

  const levelUpper = level.toUpperCase();

  if (levelUpper.includes("HIGH")) {
    return "text-red-300 border border-red-500/30 text-xs px-2 py-1 rounded font-medium";
  } else if (levelUpper.includes("MEDIUM")) {
    return "text-yellow-300 border border-yellow-500/30 text-xs px-2 py-1 rounded font-medium";
  } else if (levelUpper.includes("LOW")) {
    return "text-green-300 border border-green-500/30 text-xs px-2 py-1 rounded font-medium";
  }

  return "text-gray-200 border border-gray-500/30 text-xs px-2 py-1 rounded font-medium";
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
  return (
    <div
      className={`group h-full flex flex-col grayscale hover:grayscale-0 transition-all duration-300 hover:bg-gray-500/5 hover:border-gray-500/20  rounded-lg overflow-hidden border border-gray-700/30 ${className}`}
    >
      {/* Image with link */}
      <Link href={`/${article.id}`} className="block">
        <div
          className={`${
            featured
              ? "h-72 sm:h-96"
              : doubleHeight
                ? "h-96 sm:h-[32rem]"
                : "h-64"
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

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-gray-400 tracking-wide truncate max-w-[65%]">
              {article.creator || "ANON"}
              {(article.creator?.length || 0) <= 35 && (
                <> • {formatDate(article.isodate)}</>
              )}
            </div>
            {article.risk_level && (
              <div className={getRiskLevelClass(article.risk_level)}>
                {article.risk_level}
              </div>
            )}
          </div>

          <Link
            href={`/${article.id}`}
            className="group-hover:text-[#d6973e] transition-colors duration-300 block"
          >
            <h3
              className={`${
                featured ? "text-xl" : "text-base"
              } font-bold font-title hover:text-[#d6973e] hover:transition hover:ease-in-out duration-300 text-white leading-tight max-w-prose`}
            >
              {article.title}
            </h3>
          </Link>

          <p className="text-sm font-subtitle text-gray-300 leading-relaxed line-clamp-3 max-w-prose">
            {article.contentsnippet}
          </p>
        </div>

        <div className="flex justify-end gap-4 mt-4 pt-2 border-t border-gray-700/30">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
          >
            Original <RiExternalLinkLine className="ml-1" />
          </a>
          <Link
            href={`/${article.id}`}
            className="text-xs font-title text-[#d6973e] hover:text-[#d68b36] transition-colors duration-300 font-medium"
          >
            Our Report
          </Link>
        </div>
      </div>
    </div>
  );
}
