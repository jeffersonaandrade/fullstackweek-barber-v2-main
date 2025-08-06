/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
      {
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Otimizações para reduzir warnings do webpack
  webpack: (config, { dev }) => {
    if (dev) {
      // Desabilitar cache em desenvolvimento para evitar warnings
      config.cache = false
    }
    
    return config
  },
  // Otimizações de performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/appspecific/com.chrome.devtools.json',
        destination: '/api/devtools-config',
      },
    ]
  },
}

export default nextConfig
