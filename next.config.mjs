/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript/ESLint during builds if not actively using them
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore large/slow folders during file watching
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        ignored: ['**/node_modules', '**/.next', '**/.git', '**/public/uploads'],
      };
    }
    return config;
  },
};

export default nextConfig;
