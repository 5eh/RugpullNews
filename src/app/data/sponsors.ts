export interface Sponsor {
  id: number;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
}

export const goldSponsors: Sponsor[] = [
  {
    id: 1,
    name: "Arthur Labs",
    description: "Leading the way in blockchain research and development",
    logoUrl: "/sponsors/Arthur_Labs_Logo.png",
    websiteUrl: "https://arthurlabs.net",
  },
];

export const silverSponsors: Sponsor[] = [
  {
    id: 2,
    name: "Crypto Analytics Partners",
    description: "Advanced analytics for cryptocurrency markets",
    logoUrl: "/sponsors/cap-logo.png",
    websiteUrl: "https://example.com/cap",
  },
];

export const bronzeSponsors: Sponsor[] = [
  {
    id: 4,
    name: "Crypto News Daily",
    description: "Your source for daily crypto updates",
    logoUrl: "/sponsors/cnd-logo.png",
    websiteUrl: "https://example.com/cnd",
  },
];
