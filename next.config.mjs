/** @type {import('next').NextConfig} */
const nextConfig = {
  // HINWEIS: 'eslint' und 'typescript' Optionen wurden entfernt, da Next.js 16 sie hier nicht mehr unterstützt.
  
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },

  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      // Das Plugin entfernt "node:" Präfixe, falls doch noch welche durchrutschen
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            resource.request = resource.request.replace(/^node:/, "");
          }
        )
      );

      // 2. Jetzt definieren wir, dass "process" (und die anderen) leer sein sollen.
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
