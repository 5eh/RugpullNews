"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SAFETY_TIPS = [
  "Never share your private keys with anyone",
  "Always verify contract addresses before interacting",
  "Be skeptical of projects promising unrealistic returns",
  "Enable 2FA on all your crypto accounts",
  "Research thoroughly before investing in any project",
  "Use hardware wallets for storing significant amounts",
  "Don't trust direct messages about investment opportunities",
  "Check for code audits before using a new DeFi protocol",
  "Beware of airdrops that require you to connect your wallet",
  "Double-check URLs to avoid phishing websites",
  "Never invest more than you can afford to lose",
  "Avoid projects where you can't identify the team",
  "Be cautious of excessive FOMO marketing tactics",
];

const Loading = () => {
  const [safetyTip, setSafetyTip] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * SAFETY_TIPS.length);
    setSafetyTip(SAFETY_TIPS[randomIndex]);

    const interval = setInterval(() => {
      const newIndex = Math.floor(Math.random() * SAFETY_TIPS.length);
      setSafetyTip(SAFETY_TIPS[newIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center  px-4">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Loading Video */}
        <h1 className="text-center mt-4  text-2xl font-bold font-subtitle text-white">
          Loading<span className="animate-pulse">...</span>
        </h1>

        <div className=" relative rounded-md">
          <video
            src="/Loading.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-128 h-128 mx-auto"
            aria-label="Rugpull News loading animation"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Safety Tip Section */}
        <div className="text-center mb-8 max-w-md">
          <div className=" p-4 ">
            <h2 className="text-[#d68b36] font-medium mb-2">Safety Tip:</h2>
            <p className="text-gray-300 text-lg transition-opacity duration-500">
              {safetyTip}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center mt-4 font-content">
          <p className="text-gray-400 mb-2 text-sm">
            While you wait, check out:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/safety"
              className="text-sm text-gray-300 hover:text-white hover:bg-[#d68b36]/20 px-3 py-1 rounded-sm transition-colors duration-300"
            >
              Safety Guide
            </Link>
            <Link
              href="/education/identify-scam"
              className="text-sm text-gray-300 hover:text-white hover:bg-[#d68b36]/20 px-3 py-1 rounded-sm transition-colors duration-300"
            >
              Identify Scams
            </Link>
            <Link
              href="/education/get-out-of-scam"
              className="text-sm text-gray-300 hover:text-white hover:bg-[#d68b36]/20 px-3 py-1 rounded-sm transition-colors duration-300"
            >
              Escape Scams
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
