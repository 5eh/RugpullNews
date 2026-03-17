"use client";

import Image from "next/image";
import Link from "next/link";
import { RiExternalLinkLine } from "react-icons/ri";
import { Article } from "@/app/lib/types";
import { getRiskLevelClass, formatArticleDate } from "@/app/lib/utils";

const FALLBACK_IMAGE = "/images/article-fallback.png";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  doubleHeight?: boolean;
  className?: string;
}

export default function ArticleCard({
  article,
  featured,
  className = "",
}: ArticleCardProps) {
  return (
    <div
      className={`group flex flex-col justify-between transition-all duration-300 hover:bg-gray-500/5 hover:border-gray-500/20  overflow-hidden border border-gray-700/30 h-full ${className}`}
    >
      <Link href={`/article/${article.id}`} className="block">
        <div
          className={`${
            featured
              ? "h-52 sm:h-64 md:h-72 lg:h-80"
              : "h-40 sm:h-48 md:h-56 lg:h-64"
          } w-full overflow-hidden relative group-hover:shadow-md transition-all`}
        >
          <Image
            src={article.banner_image || FALLBACK_IMAGE}
            alt={article.title}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="transition-all duration-300 w-full h-full hover:scale-105 grayscale-[70%] group-hover:grayscale-0"
          />
        </div>
      </Link>

      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs sm:text-sm text-gray-400 tracking-wide truncate max-w-full font-medium">
              {article.creator || "ANON"}
              {(article.creator?.length || 0) <= 35 && (
                <span className="hidden md:inline">
                  {" "}
                  • {formatArticleDate(article.isodate)}
                </span>
              )}
            </div>
            <div className="block">
              {article.risk_level && (
                <div className={getRiskLevelClass(article.risk_level)}>
                  {article.risk_level}
                </div>
              )}
            </div>
          </div>

          <Link
            href={`/article/${article.id}`}
            className="group-hover:text-[#d6973e] transition-colors duration-300 block"
          >
            <h3
              className={`${
                featured
                  ? "text-base sm:text-lg md:text-xl lg:text-2xl"
                  : "text-sm sm:text-base md:text-lg"
              } font-bold font-title hover:text-[#d6973e] hover:transition hover:ease-in-out duration-300 text-white leading-tight max-w-prose`}
            >
              {article.title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm md:text-base font-subtitle text-gray-300 leading-relaxed line-clamp-2 sm:line-clamp-3 w-full tracking-wide">
            {article.contentsnippet}
          </p>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex flex-row justify-between items-center gap-2 pt-2 border-t border-gray-700/30">
            <div className="flex items-center">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
              >
                Original <RiExternalLinkLine className="ml-1" />
              </a>
            </div>
            <Link
              href={`/article/${article.id}`}
              className="text-xs sm:text-sm font-title text-[#d6973e] hover:text-[#d68b36] transition-colors duration-300 font-medium"
            >
              Our Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
