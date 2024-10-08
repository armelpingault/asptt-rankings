/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/asptt-rankings',
  distDir: 'docs',
  images: {
    unoptimized: true,
  },
  output: 'export',
};

export default nextConfig;
