"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useClickOutside } from "@/app/hooks/useClickOutside";

export function DesktopNavLinks() {
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsEducationOpen(false));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsEducationOpen(false);
    if (e.key === "ArrowDown") setIsEducationOpen(true);
  };

  return (
    <div className="hidden lg:flex items-center justify-center space-x-8 py-4 border-t border-gray-700/30">
      <button className="text-gray-300 hover:text-white transition-colors duration-300" aria-label="Search">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      <Link href="/sponsors" className="text-sm text-gray-300 hover:text-white transition-colors duration-300">
        Sponsors
      </Link>
      <Link href="/submit-post" className="text-sm text-gray-300 hover:text-white transition-colors duration-300">
        Submit a post
      </Link>
      <Link href="/submit-guide" className="text-sm text-gray-300 hover:text-white transition-colors duration-300">
        Submit a guide
      </Link>
      <Link href="/whistleblowing" className="text-sm text-gray-300 hover:text-white transition-colors duration-300">
        Safe Whistleblowing
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsEducationOpen(!isEducationOpen)}
          onKeyDown={handleKeyDown}
          className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
          aria-expanded={isEducationOpen}
          aria-haspopup="true"
          aria-controls="education-dropdown"
        >
          Education
          <svg
            className={`ml-1 h-4 w-4 transition-transform duration-200 ${isEducationOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isEducationOpen && (
          <div
            id="education-dropdown"
            role="menu"
            className="absolute right-0 mt-2 w-64 bg-black/70 backdrop-blur-2xl border border-gray-600/30 rounded-sm shadow-lg z-50"
          >
            <div className="py-2">
              <Link
                href="/education/exit-scams"
                role="menuitem"
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#d6973e] transition-colors duration-300"
                onClick={() => setIsEducationOpen(false)}
              >
                1. How to get out of a scam
              </Link>
              <Link
                href="/education/identify-scams"
                role="menuitem"
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#d6973e] transition-colors duration-300"
                onClick={() => setIsEducationOpen(false)}
              >
                2. How to identify a scam
              </Link>
              <Link
                href="/education/report-scams"
                role="menuitem"
                className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#d6973e] transition-colors duration-300"
                onClick={() => setIsEducationOpen(false)}
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
  );
}
