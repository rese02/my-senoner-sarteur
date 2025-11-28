/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore errors during build to allow for incremental development
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // 1. Image configuration to allow external domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // 2. The "heavy artillery" Webpack patch for `node:` prefix errors
  webpack: (config, { webpack, isServer }) => {
    // Only apply these changes for the browser-side build (client)
    if (!isServer) {
      
      // Step 1: Use the NormalModuleReplacementPlugin to rewrite the import.
      // This finds any import starting with "node:" (e.g., "node:process")
      // and removes the "node:" prefix, turning it into a regular module name (e.g., "process").
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            resource.request = resource.request.replace(/^node:/, "");
          }
        )
      );

      // Step 2: Now that the import is a standard name, provide an empty fallback for it.
      // This tells Webpack to replace modules like "process", "fs", etc., with an empty module
      // for the browser, where they don't exist.
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
