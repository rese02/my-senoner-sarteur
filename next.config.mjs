/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // Erlaubt alle Bilder (einfach für Dev)
    ],
  },
  
  experimental: {
    // Behebt die "Cross origin request detected" Warnung in der Cloud-Umgebung.
    allowedDevOrigins: ["*.cloudworkstations.dev"],
  },

  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      // Fix für Genkit/Firebase Admin im Browser
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (res) => {
          res.request = res.request.replace(/^node:/, "");
        })
      );
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: false, path: false, os: false, crypto: false,
        stream: false, zlib: false, fs: false, child_process: false,
        net: false, tls: false, vm: false,
      };
    }
    return config;
  },
};

export default nextConfig;
