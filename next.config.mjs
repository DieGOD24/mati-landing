/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone deja un build autocontenido, que es lo que usa el Dockerfile de Coolify
  output: 'standalone'
};

export default nextConfig;
