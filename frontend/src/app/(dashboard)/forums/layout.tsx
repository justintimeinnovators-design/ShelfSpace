import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading Forums",
  description:
    "Join book discussions, share reviews, and connect with fellow readers in ShelfSpace reading forums.",
  openGraph: {
    title: "Reading Forums on ShelfSpace",
    description: "Join book discussions and connect with fellow readers.",
    type: "website",
  },
};

export default function ForumsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
