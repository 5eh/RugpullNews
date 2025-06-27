"use client";

import React from "react";
import Image from "next/image";

interface Sponsor {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
}

interface SponsorCardProps {
  sponsor: Sponsor;
  tierClass: string;
}

const SponsorCard: React.FC<SponsorCardProps> = ({ sponsor, tierClass }) => {
  return (
    <div
      className={`p-8 rounded-lg border-2 ${tierClass} transition-all duration-300`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-64 h-64 mb-6 relative flex items-center justify-center rounded-full overflow-hidden">
          {sponsor.logoUrl ? (
            <>
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={sponsor.logoUrl}
                  alt={`${sponsor.name} logo`}
                  fill={true}
                  sizes="128px"
                  className="object-contain p-4"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement?.parentElement;
                    const fallback =
                      parent?.querySelector(".fallback-initials");
                    if (fallback) {
                      fallback.classList.remove("hidden");
                    }
                  }}
                />
              </div>
              <div className="fallback-initials absolute inset-0 flex items-center justify-center text-2xl font-bold hidden">
                {sponsor.name.substring(0, 2)}
              </div>
            </>
          ) : (
            <div className="text-2xl font-bold">
              {sponsor.name.substring(0, 2)}
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold mb-3">{sponsor.name}</h3>
        <p className="text-lg text-gray-400 mb-6">{sponsor.description}</p>
        <a
          href={sponsor.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-[#d6973e] hover:text-white transition-all duration-300 hover:shadow-md"
        >
          Visit Website
        </a>
      </div>
    </div>
  );
};

export default SponsorCard;

// Add this CSS for hover effect matching border colors
export const sponsorCardStyles = `
  .border-yellow-700\/50:hover {
    background-color: rgba(161, 98, 7, 0.15);
  }
  .border-gray-600\/50:hover {
    background-color: rgba(75, 85, 99, 0.15);
  }
  .border-amber-800\/50:hover {
    background-color: rgba(146, 64, 14, 0.15);
  }
`;
