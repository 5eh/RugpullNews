"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useScrollPosition } from "@/app/hooks/useScrollPosition";
import { CryptoTicker } from "./CryptoTicker";
import { ArticleMarquee } from "./ArticleMarquee";
import { DesktopNavLinks } from "./DesktopNavLinks";
import { MobileMenu } from "./MobileMenu";

export function NavBar() {
  const scrolled = useScrollPosition(10);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300
        ${scrolled ? "bg-black/95 backdrop-blur-xl shadow-lg" : "bg-black/80 backdrop-blur-md"}
        lg:relative md:static`}
      >
        <CryptoTicker isMobile={isMobile} />

        {/* Logo Section */}
        <div className="border-b border-gray-700/30 py-2 md:py-4">
          <div className="flex-grow text-center">
            <div className="inline-flex items-center justify-center">
              <div className="hidden lg:block w-14 h-14 overflow-hidden rounded-full mr-3">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
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

        <ArticleMarquee isMobile={isMobile} />

        <DesktopNavLinks />
      </nav>

      <MobileMenu />
    </div>
  );
}
