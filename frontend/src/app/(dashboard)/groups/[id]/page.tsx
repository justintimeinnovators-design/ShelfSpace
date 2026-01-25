import { GroupForumFeature } from "@/components/groups/GroupForumFeature";

interface GroupPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata = {
  title: "Group Forum - ShelfSpace",
  description: "Join the discussion in your reading group.",
};

export default async function GroupPage({ params }: GroupPageProps) {
  const { id } = await params;

  return <GroupForumFeature groupId={id} />;
}
