"use client";

import React from "react";
import SponsorCard from "./SponsorCard";

interface Sponsor {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
}

interface SponsorTierProps {
  title: string;
  sponsors: Sponsor[];
  tierClass: string;
  description: string;
}

const SponsorTier: React.FC<SponsorTierProps> = ({
  title,
  sponsors,
  tierClass,
  description,
}) => {
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className={`text-3xl font-bold mb-3 ${tierClass} font-title`}>
          {title}
        </h2>
        <p className="text-gray-400 text-lg mx-auto">{description}</p>
      </div>
      <div className={`flex flex-wrap justify-center gap-10 mx-auto`}>
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="w-full md:w-[45%] lg:w-[45%] xl:w-[45%] mb-10"
          >
            <SponsorCard
              sponsor={sponsor}
              tierClass={
                tierClass === "text-yellow-400"
                  ? "border-yellow-700/50 hover:bg-yellow-700/15"
                  : tierClass === "text-gray-300"
                    ? "border-gray-600/50 hover:bg-gray-600/15"
                    : "border-amber-800/50 hover:bg-amber-800/15"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorTier;
