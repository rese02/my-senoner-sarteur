/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript Fehler ignorieren (bleibt)
  typescript: { ignoreBuildErrors: true },
  
  // WICHTIG: 'eslint' wurde hier entfernt, da es in Next.js 15+ ungültig ist!

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // Erlaubt alle Bilder (einfach für Dev)
    ],
  },

  // Unser Genkit-Fix (Funktioniert nur mit Webpack, was in Next 15 Standard ist)
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            resource.request = resource.request.replace(/^node:/, "");
          }
        )
      );

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
