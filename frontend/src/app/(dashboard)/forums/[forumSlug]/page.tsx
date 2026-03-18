import { ForumFeature } from "@/components/forums/ForumFeature";
import { parseForumSlug } from "@/lib/slug";

interface GroupPageProps {
  params: Promise<{
    forumSlug: string;
  }>;
}

export const metadata = {
  title: "Group Forum - ShelfSpace",
  description: "Join the discussion in your reading group.",
};

export default async function GroupPage({ params }: GroupPageProps) {
  const { forumSlug } = await params;
  const forumId = parseForumSlug(forumSlug);

  return <ForumFeature forumId={forumId} forumSlug={forumSlug} />;
}
