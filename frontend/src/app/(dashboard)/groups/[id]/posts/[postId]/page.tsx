import { ForumPostFeature } from "@/components/groups/ForumPostFeature";

interface ForumPostPageProps {
  params: Promise<{
    id: string;
    postId: string;
  }>;
}

export const metadata = {
  title: "Forum Post - ShelfSpace",
  description: "Join the discussion in this forum post.",
};

export default async function ForumPostPage({ params }: ForumPostPageProps) {
  const { id, postId } = await params;

  return <ForumPostFeature groupId={id} postId={postId} />;
}
