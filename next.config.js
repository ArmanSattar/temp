/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_HOST_API_V2: process.env.NEXT_PUBLIC_HOST_API_V2,
  },
}

module.exports = nextConfig 