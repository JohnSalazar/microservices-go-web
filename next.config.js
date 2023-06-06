/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['m.media-amazon.com', 'github.com', 'iili.io'],
  },
  output: 'standalone',
}

module.exports = nextConfig
