import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WebVitals } from "@/components/analytics/WebVitals";
import { PerformanceInit } from "./performance-init";
import { CookieConsent } from "@/components/CookieConsent";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "NextLaunchPad",
    template: "%s | NextLaunchPad",
  },
  description: "A modern Next.js 15 SaaS template with authentication, payments, and internationalization",
  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "SaaS",
    "Template",
    "Authentication",
    "Payments",
    "Internationalization",
    "Tailwind CSS",
  ],
  authors: [
    {
      name: "NextLaunchPad Team",
      url: "https://github.com/nextlaunchpad",
    },
  ],
  creator: "NextLaunchPad Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "NextLaunchPad",
    description: "A modern Next.js 15 SaaS template with authentication, payments, and internationalization",
    siteName: "NextLaunchPad",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NextLaunchPad - Modern SaaS Template",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextLaunchPad",
    description: "A modern Next.js 15 SaaS template with authentication, payments, and internationalization",
    images: ["/og-image.png"],
    creator: "@nextlaunchpad",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 预连接到重要的第三方资源 */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://unsplash.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://api.stripe.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <PerformanceInit />
        <WebVitals />
        <ServiceWorkerRegistration />
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
