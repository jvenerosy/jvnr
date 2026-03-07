import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration hybride : pages statiques + API routes dynamiques
  output: 'standalone',
  trailingSlash: true,
  
  // Optimisations des images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Configuration pour le SEO
  generateEtags: false,
  
  // Compression et optimisations
  compress: true,
  
  // Optimisations expérimentales
  experimental: {
    // optimizeCss: true, // Désactivé car nécessite le module 'critters'
    optimizePackageImports: ['lucide-react'],
  },
  
  // Packages externes pour les composants serveur (Next.js 15)
  serverExternalPackages: [],
  
  // Optimisations du compilateur
  compiler: {
    // Supprimer les console.log en production (garder console.error)
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  
  // Headers de sécurité pour les assets statiques
  // Note: Le CSP principal est géré par le middleware avec nonces dynamiques
  async headers() {
    return [
      {
        // Headers pour les fichiers statiques (non gérés par le middleware)
        source: '/:path*.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
