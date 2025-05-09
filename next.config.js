/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgflip.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgflip.com',
        pathname: '/gif/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'scitechdaily.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
}

module.exports = nextConfig
