"use client";

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

const ArticleHintTooltip = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has seen the tooltip before
    const hasSeenTooltip = localStorage.getItem("hasSeenArticleHint");

    if (!hasSeenTooltip) {
      // Show the tooltip after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  const dismissTooltip = () => {
    setIsVisible(false);
    // Remember that the user has seen the tooltip
    localStorage.setItem("hasSeenArticleHint", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 max-w-xs md:max-w-sm z-50 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
      <div className="relative">
        <button
          onClick={dismissTooltip}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition-colors z-10"
          aria-label="Close tooltip"
        >
          <IoClose size={24} />
        </button>

        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Hover over blurred articles
          </h3>

          <p className="text-gray-700 text-sm mb-3">
            By focusing on individual posts, you prioritize fully reading and
            comprehending that article before moving on
          </p>

          <div className="rounded overflow-hidden mb-2">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
              src="/hover-demo.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <button
            onClick={dismissTooltip}
            className="w-full py-2 mt-2 bg-[#d68b36] hover:bg-[#d68b36]/80 text-white rounded text-sm font-medium transition-colors duration-300"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleHintTooltip;
