"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const Navigation = () => {
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsEducationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  return (
    <div>
      {/* Ticker Tracker */}
      <div className="border-b border-gray-700/30 overflow-hidden">
        <div className="whitespace-nowrap animate-scroll">
          <div className="inline-flex items-center space-x-8 px-4 py-2 text-sm text-gray-300">
            <span>🚨 BREAKING: New DeFi protocol exploited for $12M</span>
            <span>•</span>
            <span>⚠️ Pi Network under investigation by SEC</span>
            <span>•</span>
            <span>📊 Rug pulls up 340% this quarter</span>
            <span>•</span>
            <span>🔍 SafeMoon founders charged with fraud</span>
            <span>•</span>
            <span>💰 $2.1B lost to crypto scams in 2024</span>
            <span>•</span>
          </div>
        </div>
      </div>

      {/* Static Ticker Map */}
      <div className="border-b border-gray-700/30 overflow-x-auto">
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

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white transition-colors duration-300 p-2"
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
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
                ) : (
                  <svg
                    className="h-6 w-6"
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
                )}
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
            <div className="lg:hidden pt-4 pb-2 border-t border-gray-700/30 mt-4">
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
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Navigation;
