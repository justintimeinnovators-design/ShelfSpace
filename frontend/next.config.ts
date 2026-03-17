import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Development-friendly CSP configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development' 
              ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://www.google-analytics.com https://images.gr-assets.com https://i.gr-assets.com https://covers.openlibrary.org https://books.google.com https://lh3.googleusercontent.com https://lh4.googleusercontent.com https://lh5.googleusercontent.com https://lh6.googleusercontent.com; font-src 'self' data:; connect-src 'self' ws: wss: http://localhost:3001 http://localhost:3002 http://localhost:3003 http://localhost:3004 http://localhost:3005 http://localhost:3006 http://localhost:3007 https://www.google-analytics.com https://region1.google-analytics.com;"
              : "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://www.google-analytics.com https://images.gr-assets.com https://i.gr-assets.com https://covers.openlibrary.org https://books.google.com https://lh3.googleusercontent.com https://lh4.googleusercontent.com https://lh5.googleusercontent.com https://lh6.googleusercontent.com; font-src 'self' data:; connect-src 'self' ws: wss: https://*.onrender.com https://www.google-analytics.com https://region1.google-analytics.com;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
