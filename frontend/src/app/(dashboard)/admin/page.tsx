import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin Dashboard - ShelfSpace",
  description: "Administration and moderation panel",
};

/**
 * Admin Page.
 */
export default function AdminPage() {
  return <AdminDashboard />;
}

