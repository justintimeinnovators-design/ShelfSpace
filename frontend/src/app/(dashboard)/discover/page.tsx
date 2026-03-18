import type { Metadata } from "next";
import { DiscoverFeature } from "@/components/discover/DiscoverFeature";

export const metadata: Metadata = {
  title: "Discover Books",
  description:
    "Browse thousands of books by genre, trending titles, and AI-powered picks curated just for you on ShelfSpace.",
  openGraph: {
    title: "Discover Books on ShelfSpace",
    description: "Browse thousands of books by genre, trending titles, and AI-powered picks.",
    type: "website",
  },
};

export default function DiscoverPage() {
  return <DiscoverFeature />;
}
