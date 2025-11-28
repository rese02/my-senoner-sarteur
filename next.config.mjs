/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },

  webpack: (config, { isServer }) => {
    // Only for the browser-build
    if (!isServer) {
      // 1. ALIASING: This is the most robust way.
      // We force Webpack to treat "node:process" as non-existent.
      config.resolve.alias['node:process'] = false;
      config.resolve.alias['node:stream'] = false;
      config.resolve.alias['node:zlib'] = false;
      config.resolve.alias['node:util'] = false;

      // 2. Fallbacks for regular Node modules
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
