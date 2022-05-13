/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['randomuser.me', 'cloudflare-ipfs.com', 'loremflickr.com']
  }
}

module.exports = nextConfig
