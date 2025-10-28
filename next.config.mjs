/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [{
      source: '/',
      destination: '/dashboard',
      permanent: true
    }]
  },
  images: {
    domains: ['d297eo5mdmmrj6.cloudfront.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd297eo5mdmmrj6.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
