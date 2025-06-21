"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import React from "react";

const Navigation = () => {
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  interface Article {
    id: string;
    title: string;
    red_flags?: string | null;
    rugpull_score?: number | null;
    project_type?: string | null;
  }

  const [articles, setArticles] = useState<Article[]>([]);
  const [hoveredArticleId, setHoveredArticleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Calculate animation duration based on number of articles
  const getAnimationDuration = React.useCallback((): string => {
    if (articles.length > 5) return "120s";
    if (articles.length > 3) return "90s";
    return "60s";
  }, [articles.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsEducationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setFetchError(null);
        const response = await fetch(
          "/api/all-articles?tableFilter=rugpull_context&skipRowCount=true",
        );
        const data = await response.json();

        if (data.success && data.tables && data.tables.length > 0) {
          // Find the rugpull_context table
          const rugpullTable = data.tables.find((table: { name: string }) =>
            table.name.toLowerCase().includes("rugpull_context"),
          );

          if (rugpullTable && rugpullTable.sampleData) {
            // Define the type for raw article data from API
            interface RawArticleData {
              id: string | number;
              title: string;
              red_flags?: string | null;
              rugpull_score?: number | null;
              project_type?: string | null;
              [key: string]: unknown;
            }

            // Filter out articles without titles and IDs
            const validArticles = rugpullTable.sampleData
              .filter((article: RawArticleData) => article.id && article.title)
              .map(
                (article: RawArticleData): Article => ({
                  id: String(article.id),
                  title: String(article.title),
                  red_flags: article.red_flags || null,
                  rugpull_score:
                    typeof article.rugpull_score === "number"
                      ? article.rugpull_score
                      : null,
                  project_type: article.project_type || null,
                }),
              )
              .slice(0, 10); // Limit to 10 articles for performance

            setArticles(validArticles);
          } else {
            setFetchError("No article data available");
          }
        } else {
          setFetchError(data.error || "Failed to retrieve articles");
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setFetchError("Network error while fetching articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div>
      {/* Ticker Tracker - Dynamic Articles */}
      <div className="border-b border-gray-700/30 overflow-hidden">
        <div className="whitespace-nowrap animate-scroll">
          <div className="inline-flex items-center space-x-8 px-4 py-2 text-sm text-gray-300">
            {isLoading ? (
              <>
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#d6973e]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
                    href={`/article?id=${article.id}`}
                    className={`group flex items-center cursor-pointer transition-colors ${hoveredArticleId === article.id ? "text-[#d6973e]" : ""}`}
                    onMouseEnter={() => setHoveredArticleId(article.id)}
                    onMouseLeave={() => setHoveredArticleId(null)}
                  >
                    {/* Icon based on article type or score */}
                    {article.rugpull_score && article.rugpull_score > 7 ? (
                      <span className="mr-1">🚨</span>
                    ) : article.red_flags ? (
                      <span className="mr-1">⚠️</span>
                    ) : article.project_type &&
                      article.project_type.toLowerCase().includes("defi") ? (
                      <span className="mr-1">💰</span>
                    ) : article.project_type &&
                      article.project_type.toLowerCase().includes("nft") ? (
                      <span className="mr-1">🖼️</span>
                    ) : (
                      <span className="mr-1">📰</span>
                    )}
                    <span className="group-hover:underline">
                      {article.title.length > 60
                        ? `${article.title.substring(0, 57)}...`
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

      {/* Static Ticker Map - Hidden on mobile */}
      <div className="border-b border-gray-700/30 overflow-x-auto hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-3 md:space-x-6 mb-2 md:mb-0">
              <span>
                BTC: <span className="text-red-400">$42,156 ↓2.3%</span>
              </span>
              <span>
                ETH: <span className="text-green-400">$2,847 ↑1.8%</span>
              </span>
              <span>
                SOL: <span className="text-red-400">$98.45 ↓0.7%</span>
              </span>
              <span>
                DOGE: <span className="text-green-400">$0.087 ↑4.2%</span>
              </span>
            </div>
            <div className="flex items-center space-x-3 md:space-x-6">
              <span>
                Fear & Greed:{" "}
                <span className="text-yellow-400">48 (Neutral)</span>
              </span>
              <span>
                Gas: <span className="text-gray-300">15 gwei</span>
              </span>
              <span>
                Scams Today: <span className="text-red-400">12</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-b border-gray-700/30 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          {/* Center Logo */}
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <div className="flex-grow text-center">
              <Link
                href="/"
                className="text-3xl md:text-4xl lg:text-6xl font-bold font-title text-white hover:text-[#d6973e] transition-colors duration-300 inline-block"
              >
                RUGPULL news
              </Link>
              <p className="w-full text-center text-[#d6973e] mt-2 text-sm md:text-base">
                Helping you not get rugged.
              </p>
            </div>

            {/* Mobile menu button - hidden on desktop, moved to bottom menu */}
            <div className="lg:hidden opacity-0">
              {/* Placeholder to maintain layout, actual button moved to bottom */}
              <button className="p-2">
                <svg className="h-6 w-6 invisible" viewBox="0 0 24 24"></svg>
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-center space-x-8">
            <button className="text-gray-300 hover:text-white transition-colors duration-300">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <Link
              href="https://arthurlabs.net"
              className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
            >
              Arthur Labs
            </Link>
            <Link
              href="/sponsors"
              className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
            >
              Sponsors
            </Link>
            <Link
              href="/submit-post"
              className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
            >
              Submit a post
            </Link>
            <Link
              href="/submit-guide"
              className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
            >
              Submit a guide
            </Link>
            <Link
              href="/whistleblowing"
              className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
            >
              Safe Whistleblowing
            </Link>
            <Link
              href="/content"
              className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
            >
              Content
            </Link>
            <Link
              href="/safety"
              className="text-sm text-gray-300 hover:text-white transition-colors duration-300"
            >
              Safety precautions
            </Link>

            {/* Education Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsEducationOpen(!isEducationOpen)}
                className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
              >
                Education
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${isEducationOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isEducationOpen && (
                <div className="absolute right-0 mt-2 w-64 backdrop-blur-2xl border border-gray-600/30 rounded-sm shadow-lg z-50">
                  <div className="py-2">
                    <Link
                      href="/education/get-out-of-scam"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#d6973e] transition-colors duration-300"
                    >
                      1. How to get out of a scam
                    </Link>
                    <Link
                      href="/education/identify-scam"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#d6973e] transition-colors duration-300"
                    >
                      2. How to identify a scam
                    </Link>
                    <Link
                      href="/education/legal-report"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#d6973e] transition-colors duration-300"
                    >
                      3. File a legal report
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <button className="bg-[#d68b36] hover:bg-[#d68b36]/80 text-white px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-300">
              Subscribe
            </button>
            <button className="border border-[#d68b36] hover:border-[#d68b36]/80 text-gray-300 hover:text-white px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-300">
              Donate
            </button>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden pt-4 pb-24 border-t border-gray-700/30 mt-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-center space-x-4 mb-2">
                  <button className="text-gray-300 hover:text-white transition-colors duration-300">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-3 py-2 bg-gray-800/50 rounded-sm text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#d6973e]"
                    />
                  </div>
                </div>

                <Link
                  href="https://arthurlabs.net"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-300 py-2 px-4 hover:bg-gray-800/30 rounded-sm"
                >
                  Arthur Labs
                </Link>

                {/* Dynamic Articles Section */}
                <div className="border-t border-gray-700/30 pt-4 mt-2">
                  <h4 className="px-4 text-sm font-medium text-white mb-2">
                    Latest Articles
                  </h4>
                </div>
                <Link
                  href="/sponsors"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-300 py-2 px-4 hover:bg-gray-800/30 rounded-sm"
                >
                  Sponsors
                </Link>
                <Link
                  href="/submit-post"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-300 py-2 px-4 hover:bg-gray-800/30 rounded-sm"
                >
                  Submit a post
                </Link>
                <Link
                  href="/submit-guide"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-300 py-2 px-4 hover:bg-gray-800/30 rounded-sm"
                >
                  Submit a guide
                </Link>
                <Link
                  href="/whistleblowing"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-300 py-2 px-4 hover:bg-gray-800/30 rounded-sm"
                >
                  Safe Whistleblowing
                </Link>
                <Link
                  href="/content"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-300 py-2 px-4 hover:bg-gray-800/30 rounded-sm"
                >
                  Content
                </Link>
                <Link
                  href="/safety"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-300 py-2 px-4 hover:bg-gray-800/30 rounded-sm"
                >
                  Safety precautions
                </Link>

                {/* Education links (expanded in mobile) */}
                <div className="border-t border-gray-700/30 pt-4 mt-2">
                  <h4 className="px-4 text-sm font-medium text-white mb-2">
                    Education
                  </h4>
                  <Link
                    href="/education/get-out-of-scam"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/30 transition-colors duration-300"
                  >
                    1. How to get out of a scam
                  </Link>
                  <Link
                    href="/education/identify-scam"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/30 transition-colors duration-300"
                  >
                    2. How to identify a scam
                  </Link>
                  <Link
                    href="/education/legal-report"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/30 transition-colors duration-300"
                  >
                    3. File a legal report
                  </Link>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col space-y-2 pt-4 mt-2 border-t border-gray-700/30">
                  <button className="bg-[#d68b36] hover:bg-[#d68b36]/80 text-white px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-300">
                    Subscribe
                  </button>
                  <button className="border border-[#d68b36] hover:border-[#d68b36]/80 text-gray-300 hover:text-white px-4 py-2 rounded-sm text-sm font-medium transition-colors duration-300">
                    Donate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-200%);
          }
        }
        .animate-scroll {
          animation: scroll ${getAnimationDuration()} linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-gray-700/40 backdrop-blur-lg z-50 lg:hidden">
        <div className="flex items-center justify-around px-2 py-3">
          <Link href="/" className="flex flex-col items-center space-y-1">
            <svg
              className="h-6 w-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs text-gray-300">Home</span>
          </Link>

          <Link href="/safety" className="flex flex-col items-center space-y-1">
            <svg
              className="h-6 w-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-xs text-gray-300">Safety</span>
          </Link>

          {/* Central Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex flex-col items-center justify-center -mt-8 bg-[#d68b36] hover:bg-[#d68b36]/80 text-white rounded-full h-16 w-16 shadow-lg transition-colors duration-300"
          >
            {isMobileMenuOpen ? (
              <>
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-xs mt-1">Close</span>
              </>
            ) : (
              <>
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                <span className="text-xs mt-1">Menu</span>
              </>
            )}
          </button>

          <Link
            href="/content"
            className="flex flex-col items-center space-y-1"
          >
            <svg
              className="h-6 w-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <span className="text-xs text-gray-300">Content</span>
          </Link>

          <Link
            href="/whistleblowing"
            className="flex flex-col items-center space-y-1"
          >
            <svg
              className="h-6 w-6 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs text-gray-300">Report</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
