/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static build → ./out, deployed to Cloudflare Workers static assets.
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
