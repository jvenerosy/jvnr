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
    // Supprimer les console.log en production (désactivé temporairement pour debug)
    // removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers de sécurité et performance
  async headers() {
    // CSP pour Google Analytics, reCAPTCHA et autres services Google
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self'",
      "frame-src https://www.google.com",
      "connect-src 'self' https://www.google.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
