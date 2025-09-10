import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React compiler for React 19 compatibility
  experimental: {
    reactCompiler: false,
  },
  // Move turbo config to turbopack as it's now stable
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Handle React 19 compatibility issues
  transpilePackages: [
    '@mantine/core',
    '@mantine/hooks', 
    '@mantine/notifications',
    '@mantine/spotlight',
    'react-icons'
  ],
  // Additional webpack configuration for stability
  webpack: (config, { isServer }) => {
    // Prevent client reference manifest issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Disable strict mode temporarily to avoid hydration issues
  reactStrictMode: false,
};

export default nextConfig;