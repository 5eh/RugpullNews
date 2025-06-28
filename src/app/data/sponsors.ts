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
    description: "A dApp, blockchain and automation service provider",
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
    name: "LifeXP",
    description:
      "Capture, verify, and showcase your most meaningful life achievements as digital proof on the blockchain.",
    logoUrl: "/sponsors/LifeXP_Logo.png",
    websiteUrl: "https://lifexp.world",
  },
  {
    id: 5,
    name: "Aemula",
    description:
      "A decentralized protocol for independent journalism on a mission to reverse the trend of polarization in media.",
    logoUrl: "/sponsors/Aemula_Logo.png",
    websiteUrl: "https://aemula.com",
  },
];
