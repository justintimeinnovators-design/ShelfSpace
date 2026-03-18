/**
 * Post-level forum discussion hook.
 *
 * Loads thread metadata + post list together and offers mutation handlers
 * for posting, editing, deleting, and reactions.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import { ForumService, type ForumPostDTO, type ForumThreadDTO } from "@/lib/forum-service";

/**
 * Provides thread/post state for a specific discussion thread.
 *
 * @param forumId Forum identifier.
 * @param threadId Thread identifier.
 * @returns Thread snapshot, posts, loading/error state, and post actions.
 */
export function useForumPosts(forumId: string, threadId: string) {
  const [thread, setThread] = useState<ForumThreadDTO | null>(null);
  const [posts, setPosts] = useState<ForumPostDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    // Skip fetch until both route params are resolved.
    if (!forumId || !threadId) return;
    setLoading(true);
    setError(null);
    try {
      const [threadData, postsData] = await Promise.all([
        // Fetch in parallel to minimize perceived thread-load latency.
        ForumService.getThread(forumId, threadId),
        ForumService.listPosts(forumId, threadId, { limit: 100, offset: 0 }),
      ]);
      setThread(threadData);
      setPosts(postsData);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load discussion");
    } finally {
      setLoading(false);
    }
  }, [forumId, threadId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createPost = useCallback(
    async (content: string, parentPostId?: string) => {
      const payload: { content: string; parentPostId?: string } = { content };
      if (parentPostId) payload.parentPostId = parentPostId;
      const created = await ForumService.createPost(forumId, threadId, payload);
      setPosts((prev) => [...prev, created]);
      return created;
    },
    [forumId, threadId]
  );

  const updatePost = useCallback(
    async (postId: string, content: string) => {
      const updated = await ForumService.updatePost(forumId, threadId, postId, { content });
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      return updated;
    },
    [forumId, threadId]
  );

  const deletePost = useCallback(
    async (postId: string) => {
      await ForumService.deletePost(forumId, threadId, postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    },
    [forumId, threadId]
  );

  const addReaction = useCallback(
    async (postId: string, type: "LIKE" | "UPVOTE" | "LAUGH" | "SAD" | "ANGRY" = "LIKE") => {
      // Reaction endpoints are fire-and-forget; parent callers can decide on refetch policy.
      await ForumService.addReaction(forumId, threadId, postId, type);
    },
    [forumId, threadId]
  );

  const removeReaction = useCallback(
    async (postId: string, type: "LIKE" | "UPVOTE" | "LAUGH" | "SAD" | "ANGRY" = "LIKE") => {
      await ForumService.removeReaction(forumId, threadId, postId, type);
    },
    [forumId, threadId]
  );

  return { thread, posts, loading, error, refresh, createPost, updatePost, deletePost, addReaction, removeReaction };
}
