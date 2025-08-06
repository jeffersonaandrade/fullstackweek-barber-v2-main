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
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Desabilitar cache em desenvolvimento para evitar warnings
      config.cache = false
    } else {
      // Otimizar cache em produção
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: '.next/cache',
        compression: 'gzip',
        maxAge: 172800000, // 2 dias
      }
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
