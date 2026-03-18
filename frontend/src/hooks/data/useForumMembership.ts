"use client";

import { useCallback, useEffect, useState } from "react";
import { ForumService, type ForumMembershipDTO } from "@/lib/forum-service";

/**
 * Use Forum Membership.
 * @param forumId - forum Id value.
 * @param userId - user Id value.
 */
export function useForumMembership(forumId: string, userId: string) {
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [members, setMembers] = useState<ForumMembershipDTO[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  const verify = useCallback(async () => {
    if (!forumId || !userId) return;
    try {
      await ForumService.verifyMembership(forumId, userId);
      setIsMember(true);
    } catch {
      setIsMember(false);
    }
  }, [forumId, userId]);

  useEffect(() => {
    verify();
  }, [verify]);

  const refreshMembers = useCallback(async () => {
    setMembersLoading(true);
    setMembersError(null);
    try {
      const data = await ForumService.getMembers(forumId);
      setMembers(data);
    } catch (err: any) {
      setMembersError(err?.response?.data?.error || "Failed to load members");
    } finally {
      setMembersLoading(false);
    }
  }, [forumId]);

  return { isMember, verify, members, membersLoading, membersError, refreshMembers };
}
