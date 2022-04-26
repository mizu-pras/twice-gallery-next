/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

// module.exports = nextConfig

module.exports = {
  images: {
    domains: ['kpopping.com'],
    minimumCacheTTL: 1500,
  }
}
