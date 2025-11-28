/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // This is the fix for the "node:process" error.
    // It tells Webpack to provide empty fallbacks for Node.js modules
    // when building for the browser, which prevents the build from crashing.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: false,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

export default nextConfig;
