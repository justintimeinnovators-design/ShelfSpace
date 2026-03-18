"use client";

import { useCallback } from "react";
import { ForumService } from "@/lib/forum-service";

/**
 * Use Forum Admin.
 * @param forumId - forum Id value.
 */
export function useForumAdmin(forumId: string) {
  const updateForum = useCallback(
    async (input: { name?: string; description?: string; tags?: string[]; isPublic?: boolean }) => {
      return ForumService.update(forumId, input);
    },
    [forumId]
  );

  const deleteForum = useCallback(async () => {
    await ForumService.delete(forumId);
  }, [forumId]);

  return { updateForum, deleteForum };
}
