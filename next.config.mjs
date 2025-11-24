
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hier kommen deine Einstellungen rein, z.B. für Bilder:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
