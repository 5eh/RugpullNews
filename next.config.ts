/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "d8g0w48ggskw4go8k44gwo88.167.235.158.202.sslip.io",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ccn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "crypto.news",
        pathname: "/**",
      },
    ],
  },
};
module.exports = nextConfig;
