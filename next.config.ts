import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React compiler for React 19 compatibility
  experimental: {
    reactCompiler: false,
  },
  // Handle React 19 compatibility issues
  transpilePackages: [
    '@mantine/core',
    '@mantine/hooks', 
    '@mantine/notifications',
    '@mantine/spotlight'
  ],
  // Ensure proper build output
  output: 'standalone',
};

export default nextConfig;