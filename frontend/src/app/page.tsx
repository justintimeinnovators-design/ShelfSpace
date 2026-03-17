import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/LandingPage";

const APP_URL = process.env["NEXT_PUBLIC_APP_URL"] || "https://shelfspace.app";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ShelfSpace — Track Books, Get AI Recommendations & Join Reading Forums",
  description:
    "ShelfSpace is the free AI-powered book tracker. Manage your personal library, track reading progress, get personalised recommendations, and connect with readers in book forums.",
  alternates: { canonical: APP_URL },
  openGraph: {
    title: "ShelfSpace — Track Books, Get AI Recommendations & Join Reading Forums",
    description:
      "Free AI-powered book tracker. Manage your library, track reading, get recommendations, and join book forums.",
    url: APP_URL,
    type: "website",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ShelfSpace",
  url: APP_URL,
  description:
    "AI-powered book management and reading companion. Track your reading progress, discover new books, and connect with fellow readers.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${APP_URL}/discover?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShelfSpace",
  url: APP_URL,
  logo: `${APP_URL}/icons/icon-192x192.png`,
  sameAs: [],
};

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShelfSpace",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "AI-powered book management and reading companion. Track your reading progress, discover new books, and connect with fellow readers.",
};

export default async function HomePage() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <LandingPage />
    </>
  );
}
