/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "trendshift.io",
      "contrib.rocks",
      "registry.npmmirror.com",
    ],
    qualities: [70, 75, 80, 85, 90],
  },
};

export default nextConfig;


