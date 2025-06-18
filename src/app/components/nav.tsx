"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Navigation = () => {
  const [isEducationOpen, setIsEducationOpen] = useState(false);

  return (
    <div>
      {/* Ticker Tracker */}
      <div className=" border-b border-gray-700/30 overflow-hidden">
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
      <div className=" border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-6">
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
            <div className="flex items-center space-x-6">
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Center Logo */}
          <div className="flex items-center justify-center mb-4 gap-8">
            <Link href="/">
              <Image
                src={"/Rugpull.png"}
                alt="Rugpull news | An Arthur Labs ecosystem project."
                height={64}
                width={64}
              />
            </Link>
            <Link
              href="/"
              className="text-3xl font-bold font-title text-white hover:text-[#d6973e] transition-colors duration-300"
            >
              RugPull News
            </Link>
          </div>

          {/* Navigation Links with Search, Subscribe, Donate */}
          <div className="flex items-center justify-center space-x-8">
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
            <div className="relative">
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
