/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loja-backend-rxwb.onrender.com', 
        port: '',
        pathname: '/assets/**',
      },

      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000', // ou a porta que sua API estiver usando localmente
        pathname: '/assets/**',
      },
    ],
  },
};

module.exports = nextConfig;
