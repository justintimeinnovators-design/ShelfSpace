import { ProfilePageClient } from "@/components/profile/ProfilePageClient";

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

/**
 * Public Profile Page.
 * @param { params } - { params } value.
 */
export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;
  return <ProfilePageClient userId={username} />;
}
