import { ForumPostFeature } from "@/components/forums/ForumPostFeature";
import { parseForumSlug, parseThreadSlug } from "@/lib/slug";

interface ForumPostPageProps {
  params: Promise<{
    forumSlug: string;
    threadSlug: string;
  }>;
}

export const metadata = {
  title: "Forum Post - ShelfSpace",
  description: "Join the discussion in this forum post.",
};

export default async function ForumPostPage({ params }: ForumPostPageProps) {
  const { forumSlug, threadSlug } = await params;
  const forumId = parseForumSlug(forumSlug);
  const threadId = parseThreadSlug(threadSlug);

  return <ForumPostFeature forumId={forumId} threadId={threadId} forumSlug={forumSlug} />;
}
