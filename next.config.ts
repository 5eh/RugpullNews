// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "d8g0w48ggskw4go8k44gwo88.167.235.158.202.sslip.io",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

module.exports = nextConfig;
