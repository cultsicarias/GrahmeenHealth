/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'randomuser.me', 'i.pinimg.com', 'cdn-icons-png.flaticon.com', 'scitechdaily.com'],
  },
}

module.exports = nextConfig