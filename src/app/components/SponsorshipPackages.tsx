"use client";

import React from "react";

const SponsorshipPackages: React.FC = () => {
  return (
    <div className="mt-16 mb-16 p-10">
      <h2 className="text-2xl font-bold text-center mb-6 font-title">
        Become a Sponsor
      </h2>
      <p className="text-center max-w-2xl mx-auto mb-8 text-gray-300">
        Join our community of sponsors and help us continue our mission of
        providing crucial information about cryptocurrency scams and security
        risks. Your support helps protect the crypto community.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        <div className="p-10 rounded-lg border-2 border-yellow-700/50 hover:bg-yellow-700/15 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-3 text-yellow-400 text-center">
            Gold Tier
          </h3>
          <p className="text-lg text-gray-400 mb-6 text-center">
            Premium visibility and partnership opportunities
          </p>
          <div className="text-3xl font-bold text-center mb-6">$500/mo</div>
          <a
            href="mailto:team@rugpullnews.org?subject=Gold Sponsorship Inquiry"
            className="block w-full text-center px-6 py-3 bg-yellow-900/30 hover:bg-yellow-800/50 rounded text-yellow-200 transition-colors duration-200 text-lg"
          >
            Contact Us
          </a>
        </div>

        <div className="p-10 rounded-lg border-2 border-gray-600/50 hover:bg-gray-600/15 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-3 text-gray-300 text-center">
            Silver Tier
          </h3>
          <p className="text-lg text-gray-400 mb-6 text-center">
            Enhanced visibility and recognition
          </p>
          <div className="text-3xl font-bold text-center mb-6">$250/mo</div>
          <a
            href="mailto:team@rugpullnews.org?subject=Silver Sponsorship Inquiry"
            className="block w-full text-center px-6 py-3 bg-gray-700/30 hover:bg-gray-700/50 rounded text-white transition-colors duration-200 text-lg"
          >
            Contact Us
          </a>
        </div>

        <div className="p-10 rounded-lg border-2 border-amber-800/50 hover:bg-amber-800/15 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-3 text-amber-700 text-center">
            Bronze Tier
          </h3>
          <p className="text-lg text-gray-400 mb-6 text-center">
            Support our mission with brand recognition
          </p>
          <div className="text-3xl font-bold text-center mb-6">$100/mo</div>
          <a
            href="mailto:team@rugpullnews.org?subject=Bronze Sponsorship Inquiry"
            className="block w-full text-center px-6 py-3 bg-amber-900/30 hover:bg-amber-800/50 rounded text-amber-200 transition-colors duration-200 text-lg"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipPackages;
