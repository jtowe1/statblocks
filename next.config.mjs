/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // We'll handle ESLint separately
  },
  typescript: {
    ignoreBuildErrors: true, // We'll handle TypeScript errors separately
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media-waterdeep.cursecdn.com',
        pathname: '/**/*', // Allow all paths under this domain
      },
    ],
  },
};

export default nextConfig;