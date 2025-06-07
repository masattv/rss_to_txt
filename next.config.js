/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3003', '*.vercel.app'],
    },
  },
}

module.exports = nextConfig 