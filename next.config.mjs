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
    // Only apply this configuration for the browser build
    if (!isServer) {
      // Use aliasing to forcefully tell Webpack to treat these modules as non-existent.
      config.resolve.alias['node:process'] = false;
      config.resolve.alias['node:stream'] = false;
      config.resolve.alias['node:zlib'] = false;
      config.resolve.alias['node:util'] = false;

      // Provide fallbacks for other common Node.js modules.
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
