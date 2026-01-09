/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.krea.ai', 'replicate.delivery'],
  },
}

module.exports = nextConfig
