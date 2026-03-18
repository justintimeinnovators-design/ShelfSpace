import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env["NEXT_PUBLIC_APP_URL"] || "https://shelfspace.app";
  const isProd = process.env["NODE_ENV"] === "production";

  if (!isProd) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/library",
          "/settings",
          "/admin",
          "/onboarding",
          "/api/",
          "/dev/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
