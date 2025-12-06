/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Erlaubt Bilder von überall (wichtig für externe URLs wie das neue Logo)
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
  },
  // 3. Verhindert Fehler mit Icon-Libraries
  transpilePackages: ['lucide-react'], 
};

export default nextConfig;
