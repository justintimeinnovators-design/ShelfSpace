import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { CombinedProvider } from "@/contexts/CombinedProvider";
import GoogleAnalytics from "@/components/common/GoogleAnalytics";
import { ClientProviders } from "@/components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "ShelfSpace - Your Reading Sanctuary",
  description:
    "AI-powered book management and reading companion. Track your reading progress, discover new books, and connect with fellow readers.",
  keywords: [
    "books",
    "reading",
    "library",
    "AI",
    "book management",
    "reading tracker",
    "book recommendations",
    "reading groups",
    "book reviews",
    "personal library",
  ],
  authors: [{ name: "ShelfSpace Team" }],
  creator: "ShelfSpace",
  publisher: "ShelfSpace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env["NEXT_PUBLIC_APP_URL"] || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ShelfSpace - Your Reading Sanctuary",
    description: "AI-powered book management and reading companion",
    url: "/",
    siteName: "ShelfSpace",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShelfSpace - Your Reading Sanctuary",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShelfSpace - Your Reading Sanctuary",
    description: "AI-powered book management and reading companion",
    images: ["/og-image.png"],
    creator: "@shelfspace",
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
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f59e0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f59e0b" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ShelfSpace" />
      </head>
      <body className="font-sans">
        <AuthProvider>
          <CombinedProvider>
            <ClientProviders>{children}</ClientProviders>
          </CombinedProvider>
        </AuthProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
