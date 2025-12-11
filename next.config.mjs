/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignoriere TypeScript/Linting Fehler beim Build für schnelleren Start
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // Bilderquellen erlauben
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },

  // WICHTIG: Webpack Konfiguration für Genkit & Stabilität
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      // 1. Plugin: Entfernt "node:" Präfixe (z.B. node:process -> process)
      // Das verhindert den Absturz im Browser
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            resource.request = resource.request.replace(/^node:/, "");
          }
        )
      );

      // 2. Fallbacks: Sagt dem Browser, dass er Server-Module ignorieren soll
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
