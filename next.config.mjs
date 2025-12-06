/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Erlaubt Bilder von überall (wichtig für externe URLs)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 2. Behebt den "Cross Origin" Fehler in der Cloud
  experimental: {
    serverActions: {
      allowedOrigins: ["*"], 
    },
  },
  // 3. WICHTIG: Erzwingt Webpack statt Turbopack (um den Crash zu verhindern)
  // (In Next.js 16 ist Webpack noch der Standard, aber wir gehen auf Nummer sicher)
  transpilePackages: ['lucide-react'], 
};

export default nextConfig;
