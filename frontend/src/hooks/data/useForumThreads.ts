/**
 * Thread-level forum data hook.
 *
 * Manages a forum's discussion threads and exposes operations for create,
 * update, and delete while keeping local thread state synchronized.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import { ForumService, type ForumThreadDTO } from "@/lib/forum-service";

/**
 * Provides thread state and actions for a single forum.
 *
 * @param forumId Parent forum identifier.
 * @returns Thread list state and mutation actions.
 */
export function useForumThreads(forumId: string) {
  const [threads, setThreads] = useState<ForumThreadDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    // Empty forum id can occur briefly during route transitions.
    if (!forumId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await ForumService.listThreads(forumId, { limit: 50, offset: 0 });
      setThreads(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load discussions");
    } finally {
      setLoading(false);
    }
  }, [forumId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createThread = useCallback(
    async (input: { title: string; content: string }) => {
      // Insert new thread at top to match "latest-first" UX expectation.
      const created = await ForumService.createThread(forumId, input);
      setThreads((prev) => [created, ...prev]);
      return created;
    },
    [forumId]
  );

  const updateThread = useCallback(
    async (threadId: string, input: { title?: string; content?: string; isPinned?: boolean; isLocked?: boolean }) => {
      const updated = await ForumService.updateThread(forumId, threadId, input);
      setThreads((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      return updated;
    },
    [forumId]
  );

  const deleteThread = useCallback(
    async (threadId: string) => {
      await ForumService.deleteThread(forumId, threadId);
      setThreads((prev) => prev.filter((t) => t.id !== threadId));
    },
    [forumId]
  );

  return { threads, loading, error, refresh, createThread, updateThread, deleteThread };
}
