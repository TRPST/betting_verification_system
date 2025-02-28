/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TypeScript errors during Netlify builds
  },

  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors during Netlify builds
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TypeScript errors during Netlify builds
  },
  compress: true,
};

module.exports = nextConfig;
