/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['kpopping.com'],
    minimumCacheTTL: 60,
  }
}

module.exports = nextConfig

// module.exports = {
//   images: {
//     domains: ['kpopping.com'],
//     minimumCacheTTL: 60,
//   }
// }
