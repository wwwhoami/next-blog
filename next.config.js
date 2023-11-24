/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'randomuser.me'
    },
    {
      protocol: 'https',
      hostname: 'cloudflare-ipfs.com'
    },
    {
      protocol: 'https',
      hostname: 'loremflickr.com'
    },
    {
      protocol: 'https',
      hostname: 'avatars.githubusercontent.com'
    }]
  }
}

module.exports = nextConfig
