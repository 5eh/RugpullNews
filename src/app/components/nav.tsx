"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Define interfaces
interface CoinPrice {
  symbol: string;
  price: number;
  formattedPrice: string;
  change: number;
  formattedChange: string;
  color: string;
}

interface ApiResponse {
  success: boolean;
  data?: CoinPrice[];
  error?: string;
}

const Navigation = () => {
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
  const [cryptoPrices, setCryptoPrices] = useState<CoinPrice[]>([]);
  const [cryptoLoading, setCryptoLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Function to fetch crypto prices from our API
  const fetchCryptoPrices = async () => {
    try {
      setCryptoLoading(true);
      const response = await fetch("/api/get-prices");
      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        setCryptoPrices(data.data);
      } else {
        console.error("Error fetching crypto prices:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch crypto prices:", error);
    } finally {
      setCryptoLoading(false);
    }
  };

  // Calculate animation duration based on number of articles
  const getAnimationDuration = React.useCallback((): string => {
    if (articles.length > 5) return "120s";
    if (articles.length > 3) return "90s";
    return "60s";
  }, [articles.length]);

  // Calculate mobile animation duration (faster on mobile)
  const getMobileAnimationDuration = React.useCallback((): string => {
    if (articles.length > 5) return "40s";
    if (articles.length > 3) return "30s";
    return "25s";
  }, [articles.length]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Fetch crypto prices when component mounts
  useEffect(() => {
    fetchCryptoPrices();

    // Refresh prices every 60 seconds
    const interval = setInterval(() => {
      fetchCryptoPrices();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
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
      {/* MOBILE NAVIGATION STRUCTURE */}
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300
        ${scrolled ? "bg-black/95 backdrop-blur-xl shadow-lg" : "bg-black/80 backdrop-blur-md"}
        lg:relative md:static`}
      >
        {/* 1. Ticker Tracker - Dynamic Articles (TOP) */}
        <div className="border-b border-gray-700/30 overflow-hidden">
          <div className="whitespace-nowrap animate-scroll">
            <div className="inline-flex items-center space-x-4 md:space-x-8 px-4 py-1 md:py-2 text-xs md:text-sm text-gray-300">
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
                      href={`/${article.id}`}
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
                        article.project_type.toLowerCase().includes("coin") ? (
                        <span className="mr-1">💰</span>
                      ) : article.project_type &&
                        article.project_type.toLowerCase().includes("nft") ? (
                        <span className="mr-1">🖼️</span>
                      ) : (
                        <span className="mr-1">📰</span>
                      )}
                      <span className="group-hover:underline">
                        {article.title.length > 50
                          ? `${article.title.substring(0, 47)}...`
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

        {/* 2. Logo Section (MIDDLE) */}
        <div className="border-b border-gray-700/30 py-2 md:py-4">
          <div className="flex-grow text-center">
            <div className="inline-flex items-center justify-center">
              <div className="hidden lg:block w-14 h-14 overflow-hidden rounded-full mr-3">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/Logo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <Link
                href="/"
                className="text-2xl md:text-4xl lg:text-6xl font-bold font-title text-white hover:text-[#d6973e] transition-colors duration-300 inline-block"
              >
                RUGPULL news
              </Link>
            </div>
            <p className="w-full text-center text-[#d6973e] mt-0 md:mt-2 text-[10px] md:text-sm">
              Helping you not get rugged.
            </p>
          </div>
        </div>

        {/* 3. Crypto Prices Section (BOTTOM) */}
        <div className="border-b border-gray-700/30 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-2 md:px-4 py-1 md:py-3">
            <div className="flex items-center justify-center space-x-3 md:space-x-6 overflow-x-auto whitespace-nowrap pb-1 w-full scrollbar-hide">
              {["BTC", "ETH", "DOT", "DOGE"].map((symbol) => {
                if (cryptoLoading) {
                  return (
                    <span
                      key={symbol}
                      className="inline-block text-xs md:text-sm"
                    >
                      {symbol}: <span className="text-gray-400">N/A</span>
                    </span>
                  );
                }

                const coin = cryptoPrices.find((c) => c.symbol === symbol);
                return coin ? (
                  <span
                    key={coin.symbol}
                    className="inline-block text-xs md:text-sm"
                  >
                    {coin.symbol}:{" "}
                    <span className={`text-${coin.color}-400`}>
                      {coin.formattedPrice} {coin.formattedChange}
                    </span>
                  </span>
                ) : (
                  <span
                    key={symbol}
                    className="inline-block text-xs md:text-sm"
                  >
                    {symbol}: <span className="text-gray-400">N/A</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links - Only visible on desktop */}
        <div className="hidden lg:flex items-center justify-center space-x-8 py-4 border-t border-gray-700/30">
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
                    href="/education/exit-scams"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#d6973e] transition-colors duration-300"
                  >
                    1. How to get out of a scam
                  </Link>
                  <Link
                    href="/education/identify-scams"
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#d6973e] transition-colors duration-300"
                  >
                    2. How to identify a scam
                  </Link>
                  <Link
                    href="/education/report-scams"
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
      </nav>

      {/* DESKTOP NAVIGATION - Moved inside nav for proper layout */}

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-[180px] left-0 right-0 bottom-16 bg-black/95 backdrop-blur-xl overflow-y-auto z-40 pb-10 pt-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-4 mb-2 px-4">
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
            <div className="border-t border-gray-700/30 pt-3 mt-2">
              <h4 className="px-4 text-sm font-medium text-white mb-2">
                Latest Articles
              </h4>
              <div className="px-4 space-y-2">
                {articles.slice(0, 3).map((article, index) => (
                  <Link
                    key={article.id || index}
                    href={`/${article.id}`}
                    className="block text-xs text-gray-300 hover:text-[#d6973e] py-1 border-b border-gray-700/20"
                  >
                    {article.title.length > 40
                      ? `${article.title.substring(0, 37)}...`
                      : article.title}
                  </Link>
                ))}
              </div>
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
            <div className="flex flex-col space-y-2 pt-4 mt-2 border-t border-gray-700/30 px-4">
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

      {/* Mobile bottom menu button */}
      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-3xl border-t border-gray-700/40 z-40 lg:hidden">
        <div className="flex items-center justify-around px-2 py-3">
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
              </>
            )}
          </button>
        </div>
      </div>

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

        @media (max-width: 767px) {
          .animate-scroll {
            animation: scroll ${getMobileAnimationDuration()} linear infinite;
          }

          /* Hide scrollbars for clean mobile experience */
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Navigation;
