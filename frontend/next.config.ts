import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Force App Router
  // Development-friendly CSP configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development' 
              ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://www.google-analytics.com; font-src 'self' data:; connect-src 'self' ws: wss: http://127.0.0.1:8000 http://localhost:8000 http://localhost:3001 http://localhost:3003 https://www.google-analytics.com https://region1.google-analytics.com;"
              : "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://www.google-analytics.com; font-src 'self' data:; connect-src 'self' ws: wss: http://chatbot-service:8000 https://*.onrender.com https://www.google-analytics.com https://region1.google-analytics.com;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
