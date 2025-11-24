/** @type {import('next').NextConfig} */
const nextConfig = {
  // Erlaubt Server Actions von überall (Wichtig für Firebase Studio!)
  experimental: {
    serverActions: {
      allowedOrigins: ['*'], 
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
};

export default nextConfig;
