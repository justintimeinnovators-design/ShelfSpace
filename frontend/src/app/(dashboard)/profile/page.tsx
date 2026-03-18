import type { Metadata } from "next";
import { ProfilePageClient } from "@/components/profile/ProfilePageClient";

export const metadata: Metadata = {
  title: "Profile | ShelfSpace",
  description: "View and manage your ShelfSpace profile and preferences.",
  alternates: { canonical: "/profile" },
  robots: { index: false, follow: true },
};

/**
 * Profile Page.
 */
export default function ProfilePage() {
  return <ProfilePageClient />;
}
