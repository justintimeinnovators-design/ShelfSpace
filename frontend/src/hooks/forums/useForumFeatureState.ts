import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useForum } from "@/hooks/data/useForums";
import { useForumThreads } from "@/hooks/data/useForumThreads";
import { useForumMembership } from "@/hooks/data/useForumMembership";
import { useForumAdmin } from "@/hooks/data/useForumAdmin";
import { type ForumThreadDTO } from "@/lib/forum-service";
import apiClient from "@/lib/api";

type TabType = "forum" | "chat";

/**
 * State/controller hook for `ForumFeature`.
 *
 * Consolidates forum membership, thread CRUD, forum admin actions, and profile
 * enrichment so the component can focus on rendering.
 */
export function useForumFeatureState({
  forumId,
  onForumDeleted,
}: {
  forumId: string;
  onForumDeleted: () => void;
}) {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const { forum, loading, error, isMember, joinForum, leaveForum, refresh } =
    useForum(forumId);
  const {
    threads,
    loading: threadsLoading,
    error: threadsError,
    createThread,
    updateThread,
    deleteThread,
  } = useForumThreads(forumId);
  const [activeTab, setActiveTab] = useState<TabType>("forum");
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editThreadTitle, setEditThreadTitle] = useState("");
  const [editThreadContent, setEditThreadContent] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [userProfiles, setUserProfiles] = useState<Record<string, { name?: string }>>({});
  const userProfilesRef = useRef<Record<string, { name?: string }>>({});
  const [editingForum, setEditingForum] = useState(false);
  const [editForumName, setEditForumName] = useState("");
  const [editForumDescription, setEditForumDescription] = useState("");
  const [editForumTags, setEditForumTags] = useState("");
  const {
    isMember: verifiedMember,
    verify,
    members,
    membersLoading,
    membersError,
    refreshMembers,
  } = useForumMembership(forumId, userId);
  const { updateForum, deleteForum } = useForumAdmin(forumId);

  const userIsMember = verifiedMember ?? isMember(userId);
  const userMembership = forum?.memberships?.find((m) => m.userId === userId);
  const isForumAdmin = userMembership?.role === "ADMIN";
  const canPost = userIsMember;

  useEffect(() => {
    if (!forum) return;
    setEditForumName(forum.name || "");
    setEditForumDescription(forum.description || "");
    setEditForumTags((forum.tags || []).join(", "));
  }, [forum]);

  const handleCreateThread = async () => {
    if (!userIsMember) {
      alert("Join the forum to start a discussion.");
      return;
    }
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      alert("Title and content are required.");
      return;
    }
    await createThread({
      title: newThreadTitle.trim(),
      content: newThreadContent.trim(),
    });
    setNewThreadTitle("");
    setNewThreadContent("");
    setShowComposer(false);
  };

  const startEditThread = (thread: ForumThreadDTO) => {
    setEditingThreadId(thread.id);
    setEditThreadTitle(thread.title);
    setEditThreadContent(thread.content);
  };

  const cancelEditThread = () => {
    setEditingThreadId(null);
    setEditThreadTitle("");
    setEditThreadContent("");
  };

  const handleUpdateThread = async () => {
    if (!editingThreadId) return;
    const updates: { title?: string; content?: string } = {};
    const trimmedTitle = editThreadTitle.trim();
    const trimmedContent = editThreadContent.trim();
    if (trimmedTitle) updates.title = trimmedTitle;
    if (trimmedContent) updates.content = trimmedContent;
    await updateThread(editingThreadId, updates);
    cancelEditThread();
  };

  const handleDeleteThread = async (threadId: string) => {
    const confirmed = window.confirm(
      "Delete this discussion? This cannot be undone."
    );
    if (!confirmed) return;
    await deleteThread(threadId);
  };

  const handleUpdateForum = async () => {
    if (!forum) return;
    const updates: { name?: string; description?: string; tags?: string[] } = {};
    const trimmedName = editForumName.trim();
    const trimmedDescription = editForumDescription.trim();
    const tags = editForumTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (trimmedName) updates.name = trimmedName;
    if (trimmedDescription) updates.description = trimmedDescription;
    if (tags.length > 0) updates.tags = tags;

    await updateForum(updates);
    setEditingForum(false);
    await refresh();
  };

  const handleDeleteForum = async () => {
    if (!forum) return;
    const confirmed = window.confirm("Delete this forum? This cannot be undone.");
    if (!confirmed) return;
    await deleteForum();
    onForumDeleted();
  };

  const handleJoinForum = async () => {
    await joinForum();
    await verify();
  };

  const handleLeaveForum = async () => {
    await leaveForum();
    await verify();
  };

  const pinnedThreads = threads.filter((t) => t.isPinned);
  const recentThreads = threads.filter((t) => !t.isPinned);

  useEffect(() => {
    let cancelled = false;
    const fetchProfiles = async () => {
      const ids = new Set<string>();
      if (showMembers) {
        members.forEach((m) => ids.add(m.userId));
      }
      threads.forEach((t) => ids.add(t.createdById));
      const missing = Array.from(ids).filter(
        (id) => !userProfilesRef.current[id]
      );
      if (missing.length === 0) return;

      try {
        const results = await Promise.all(
          missing.map(async (id) => {
            const { data } = await apiClient.get(`/api/user/lookup/${id}`);
            return [id, data] as const;
          })
        );
        if (cancelled) return;
        setUserProfiles((prev) => {
          const next = { ...prev };
          results.forEach(([id, data]) => {
            next[id] = { name: data?.name || undefined };
          });
          userProfilesRef.current = next;
          return next;
        });
      } catch {
        // best effort
      }
    };

    fetchProfiles();
    return () => {
      cancelled = true;
    };
  }, [showMembers, members, threads]);

  const displayNameFor = (profileUserId: string) => {
    const name = userProfiles[profileUserId]?.name;
    if (name) return name;
    return "Reader";
  };

  return {
    session,
    forum,
    loading,
    error,
    activeTab,
    setActiveTab,
    threads,
    threadsLoading,
    threadsError,
    showComposer,
    setShowComposer,
    newThreadTitle,
    setNewThreadTitle,
    newThreadContent,
    setNewThreadContent,
    editingThreadId,
    editThreadTitle,
    setEditThreadTitle,
    editThreadContent,
    setEditThreadContent,
    showMembers,
    setShowMembers,
    editingForum,
    setEditingForum,
    editForumName,
    setEditForumName,
    editForumDescription,
    setEditForumDescription,
    editForumTags,
    setEditForumTags,
    members,
    membersLoading,
    membersError,
    refreshMembers,
    pinnedThreads,
    recentThreads,
    userIsMember,
    isForumAdmin,
    canPost,
    handleCreateThread,
    startEditThread,
    cancelEditThread,
    handleUpdateThread,
    handleDeleteThread,
    handleUpdateForum,
    handleDeleteForum,
    handleJoinForum,
    handleLeaveForum,
    displayNameFor,
  };
}
