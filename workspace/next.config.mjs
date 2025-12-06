/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Bilder von überall erlauben
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 2. WICHTIG: Erlaubt deine Cloud-Umgebung (behebt die rote Warnung)
  experimental: {
    serverActions: {
      allowedOrigins: ["*"], // Erlaubt alle Origins für Server Actions
    },
    // Erlaubt die Cloud-URL für den Dev-Server
    allowedDevOrigins: [
      "localhost:9002",
      "*.cloudworkstations.dev", 
      "*.firebase-studio.com"
    ],
  },
  // 3. Verhindert Fehler mit Icon-Libraries
  transpilePackages: ['lucide-react'], 
};

export default nextConfig;
