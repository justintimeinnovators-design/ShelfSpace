import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Join ShelfSpace Free",
  description:
    "Create your free ShelfSpace account. Track your books, set reading goals, get AI-powered recommendations, and join reading communities.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Sign Up — Join ShelfSpace Free",
    description:
      "Create your free ShelfSpace account and start your reading journey today.",
    type: "website",
  },
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
