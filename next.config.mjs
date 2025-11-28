/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },

  webpack: (config, { isServer }) => {
    // Only apply this configuration for the browser build (client-side)
    if (!isServer) {
      // 1. ALIASING: Force Webpack to treat 'node:process' and other node built-ins as 'false' (non-existent).
      config.resolve.alias['node:process'] = false;
      config.resolve.alias['node:stream'] = false;
      config.resolve.alias['node:zlib'] = false;
      config.resolve.alias['node:util'] = false;

      // 2. FALLBACKS: Provide empty fallbacks for other standard Node.js modules.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        zlib: false,
        fs: false,
        child_process: false,
        net: false,
        tls: false,
        vm: false,
      };
    }
    return config;
  },
};

export default nextConfig;
