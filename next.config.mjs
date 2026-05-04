/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/blog-api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      {
        source: '/feedback-api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
