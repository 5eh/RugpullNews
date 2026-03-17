"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Close on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="lg:hidden fixed left-12 right-12 bottom-20 bg-black/30 border border-gray-600 backdrop-blur-xl z-40"
        >
          <div className="flex flex-col px-4 py-3">
            <div className="gap-3 mb-4 grid w-full">
              <button
                className="bg-[#d68b36] hover:bg-[#d68b36]/80 text-white px-4 py-3 rounded text-sm font-medium transition-colors duration-200 active:scale-95"
                onClick={() => setIsOpen(false)}
              >
                Subscribe
              </button>
              <button
                className="border-2 border-[#d68b36] hover:border-[#d68b36]/80 text-white hover:bg-[#d68b36]/20 px-4 py-3 rounded text-sm font-medium transition-all duration-200 active:scale-95"
                onClick={() => setIsOpen(false)}
              >
                Donate
              </button>
            </div>

            <div className="mb-4 pb-3 border-b border-gray-700/30">
              <h4 className="text-xs font-semibold text-[#d6973e] mb-2 uppercase tracking-wide">
                Education
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <Link
                  href="/education/exit-scams"
                  className="block text-sm text-gray-300 hover:text-white hover:bg-[#d6973e]/50 py-2.5 px-3 rounded transition-colors active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  Exit Scams
                </Link>
                <Link
                  href="/education/identify-scams"
                  className="block text-sm text-gray-300 hover:text-white hover:bg-[#d6973e]/50 py-2.5 px-3 rounded transition-colors active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  Identify Scams
                </Link>
                <Link
                  href="/education/report-scams"
                  className="block text-sm text-gray-300 hover:text-white hover:bg-[#d6973e]/50 py-2.5 px-3 rounded transition-colors active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  File Report
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1">
              {[
                { href: "/sponsors", label: "Sponsors" },
                { href: "/submit-post", label: "Submit Post" },
                { href: "/submit-guide", label: "Submit Guide" },
                { href: "/whistleblowing", label: "Whistleblow" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-center text-sm text-gray-300 hover:text-white bg-gray-800/30 hover:bg-gray-700/50 transition-all duration-200 py-3 px-4 rounded border border-gray-700/40 active:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="flex items-center justify-around px-2 py-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            className="flex flex-col items-center justify-center -mt-8 bg-[#d68b36] hover:bg-[#d68b36]/80 text-white rounded-full h-16 w-16 shadow-lg transition-colors duration-300"
          >
            {isOpen ? (
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
