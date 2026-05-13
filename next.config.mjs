/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/feedback_landing',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
