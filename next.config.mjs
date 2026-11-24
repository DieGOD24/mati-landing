/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone deja un build autocontenido, que es lo que usa el Dockerfile de Coolify
  output: 'standalone',
  async rewrites() {
    const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.API_URL || 'http://api-mati.31.97.218.221.sslip.io/api';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

