/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/ctfd/:path*',
        destination: 'http://ethics.golomtbank.com/api/v1/:path*',
      },
    ]
  },
}

export default nextConfig
