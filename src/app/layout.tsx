import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700", "900"], // Regular, Bold, Black
});

export const metadata: Metadata = {
  title: {
    default: "JVNR - Créateur de solutions digitales performantes | 15+ ans d'expérience | SEO & Performance",
    template: "%s | JVNR - Créateur de solutions digitales performantes"
  },
  description: "Développeur web expert avec plus de 15 ans d'expérience. Spécialisé en création de sites performants, optimisation SEO, accessibilité web et développement React/Next.js. Basé en France, services personnalisés pour entreprises et startups.",
  keywords: [
    "créateur de solutions digitales performantes",
    "développeur freelance France",
    "création site web performant",
    "optimisation SEO technique",
    "développeur React Next.js",
    "performance web Core Web Vitals",
    "accessibilité web WCAG",
    "audit SEO technique",
    "développement sur mesure",
    "consultant web performance",
    "expert SEO France",
    "développeur TypeScript",
    "site web responsive",
    "Progressive Web App",
    "e-commerce personnalisé"
  ],
  authors: [{ name: "JVNR", url: "https://jvnr.com" }],
  creator: "JVNR",
  publisher: "JVNR",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://jvnr.com'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/',
    },
  },
  openGraph: {
    title: "JVNR - Créateur de solutions digitales performantes | 15+ ans d'expérience",
    description: "Développeur web expert avec plus de 15 ans d'expérience. Création de sites performants, optimisation SEO et développement React/Next.js sur mesure.",
    type: "website",
    locale: "fr_FR",
    url: "https://jvnr.com",
    siteName: "JVNR - Créateur de solutions digitales performantes",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JVNR - Créateur de solutions digitales performantes avec 15+ ans d'expérience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JVNR - Créateur de solutions digitales performantes | 15+ ans d'expérience",
    description: "Développeur web expert spécialisé en SEO, performance et accessibilité. Plus de 15 ans d'expérience en développement React/Next.js.",
    images: ["/twitter-image.jpg"],
    creator: "@jvnr_dev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <StructuredData />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* <link rel="icon" href="/icon.svg" type="image/svg+xml" /> */}
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body
        className={`${inter.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
