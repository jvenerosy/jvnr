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
    // Supprimer les console.log en production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers de sécurité et performance - désactivés pour l'export statique
  // Les headers seront configurés au niveau du serveur web (nginx)
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'X-Content-Type-Options',
  //           value: 'nosniff',
  //         },
  //         {
  //           key: 'X-Frame-Options',
  //           value: 'DENY',
  //         },
  //         {
  //           key: 'X-XSS-Protection',
  //           value: '1; mode=block',
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'strict-origin-when-cross-origin',
  //         },
  //         {
  //           key: 'Permissions-Policy',
  //           value: 'camera=(), microphone=(), geolocation=()',
  //         },
  //         {
  //           key: 'Strict-Transport-Security',
  //           value: 'max-age=31536000; includeSubDomains; preload',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/sitemap.xml',
  //       headers: [
  //         {
  //           key: 'Content-Type',
  //           value: 'application/xml',
  //         },
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=86400, s-maxage=86400',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/robots.txt',
  //       headers: [
  //         {
  //           key: 'Content-Type',
  //           value: 'text/plain',
  //         },
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=86400, s-maxage=86400',
  //         },
  //       ],
  //     },
  //     {
  //       source: '/static/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
