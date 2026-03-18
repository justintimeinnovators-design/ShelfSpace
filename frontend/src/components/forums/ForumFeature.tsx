"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Plus,
  Search,
  Pin,
  Calendar,
} from "lucide-react";
import { useForum } from "@/hooks/data/useForums";
import { useForumThreads } from "@/hooks/data/useForumThreads";
import { useForumMembership } from "@/hooks/data/useForumMembership";
import { useForumAdmin } from "@/hooks/data/useForumAdmin";
import { useSession } from "next-auth/react";
import { type ForumThreadDTO } from "@/lib/forum-service";
import { toThreadSlug } from "@/lib/slug";
import { ForumDetailSkeleton } from "@/components/skeletons/SkeletonComponents";
import apiClient from "@/lib/api";

interface ForumFeatureProps {
  forumId: string;
  forumSlug: string;
}

export function ForumFeature({ forumId, forumSlug }: ForumFeatureProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const { forum, loading, error, isMember, joinForum, leaveForum, refresh } = useForum(forumId);
  const { threads, loading: threadsLoading, error: threadsError, createThread, updateThread, deleteThread } =
    useForumThreads(forumId);
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
  const { isMember: verifiedMember, verify, members, membersLoading, membersError, refreshMembers } =
    useForumMembership(forumId, userId);
  const { updateForum, deleteForum } = useForumAdmin(forumId);

  // Check if current user is a member
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
    const confirmed = window.confirm("Delete this discussion? This cannot be undone.");
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
    router.push("/forums");
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
      const missing = Array.from(ids).filter((id) => !userProfilesRef.current[id]);
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

  if (loading) {
    return <ForumDetailSkeleton />;
  }

  if (error || !forum) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            {error ? "Error Loading Forum" : "Forum Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-slate-300 mb-6">
            {error || "The forum you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.push("/forums")}
            className="inline-flex items-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative z-10">
      <div className="relative container mx-auto px-4 py-8 z-20">
        <button
          onClick={() => router.push("/forums")}
          className="inline-flex items-center text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-50 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Forums
        </button>

        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
          <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 font-serif mb-2">
                    {forum.name}
                  </h1>
                  <p className="text-gray-600 dark:text-slate-400 text-lg">
                    {forum.description || "No description available"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {(forum.tags || []).length > 0 ? (
                  forum.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-slate-700 dark:text-amber-200 border border-amber-200 dark:border-slate-600"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs text-gray-500 dark:text-slate-400 bg-white/70 dark:bg-slate-700/60 border border-amber-200/60 dark:border-slate-600">
                    No tags yet
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div className="rounded-xl border border-amber-200 dark:border-slate-700 bg-amber-50/70 dark:bg-slate-700/40 p-3">
                  <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                    Members
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-slate-100">
                    {forum.memberships?.length || 0}
                  </div>
                </div>
                <div className="rounded-xl border border-amber-200 dark:border-slate-700 bg-white/80 dark:bg-slate-700/30 p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-600 dark:text-slate-300">
                    Discussions
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-slate-100">
                    {threads.length}
                  </div>
                </div>
                <div className="rounded-xl border border-amber-200 dark:border-slate-700 bg-white/80 dark:bg-slate-700/30 p-3">
                  <div className="text-xs uppercase tracking-wide text-gray-600 dark:text-slate-300">
                    Created
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(forum.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="rounded-xl border border-amber-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/80 p-4">
                <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
                  Membership
                </div>
                {userIsMember ? (
                  <button
                    onClick={handleLeaveForum}
                    className="w-full px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Users className="h-4 w-4 mr-1 inline" />
                    Leave Forum
                  </button>
                ) : (
                  <button
                    onClick={handleJoinForum}
                    className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <Users className="h-4 w-4 mr-1 inline" />
                    Join Forum
                  </button>
                )}
                <div className="text-xs text-gray-500 dark:text-slate-400 mt-3">
                  {userIsMember
                    ? "You can post and participate in discussions."
                    : "Join to start and reply to discussions."}
                </div>
              </div>

              {isForumAdmin && (
                <div className="rounded-xl border border-amber-200 dark:border-slate-700 bg-amber-50/70 dark:bg-slate-700/40 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">Admin Controls</div>
                    <button
                      onClick={() => setEditingForum((v) => !v)}
                      className="px-3 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs"
                    >
                      {editingForum ? "Close" : "Edit Forum"}
                    </button>
                  </div>
                  {editingForum && (
                    <div className="space-y-3">
                      <input
                        className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                        value={editForumName}
                        onChange={(e) => setEditForumName(e.target.value)}
                        placeholder="Forum name"
                      />
                      <textarea
                        className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm min-h-[80px]"
                        value={editForumDescription}
                        onChange={(e) => setEditForumDescription(e.target.value)}
                        placeholder="Forum description"
                      />
                      <input
                        className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                        value={editForumTags}
                        onChange={(e) => setEditForumTags(e.target.value)}
                        placeholder="Tags (comma separated)"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleUpdateForum}
                          className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleDeleteForum}
                          className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-xs"
                        >
                          Delete Forum
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
              <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search discussions..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowComposer((prev) => !prev)}
                    disabled={!canPost}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                      canPost
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    {showComposer ? "Close" : "New Discussion"}
                  </button>
                </div>
                {showComposer && (
                  <div className="mt-4 space-y-2">
                    <input
                      className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder="Discussion title"
                      value={newThreadTitle}
                      onChange={(e) => setNewThreadTitle(e.target.value)}
                    />
                    <textarea
                      className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm min-h-[110px]"
                      placeholder="Start the discussion..."
                      value={newThreadContent}
                      onChange={(e) => setNewThreadContent(e.target.value)}
                    />
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setShowComposer(false)}
                        className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateThread}
                        className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs"
                      >
                        Post Discussion
                      </button>
                    </div>
                  </div>
                )}
                {!canPost && (
                  <div className="mt-3 text-xs text-amber-700 dark:text-amber-200">
                    Join this forum to create a discussion.
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {threadsLoading && (
                  <div className="text-sm text-gray-600 dark:text-slate-400">Loading discussions...</div>
                )}
                {threadsError && <div className="text-sm text-red-600">{threadsError}</div>}

                {pinnedThreads.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Pin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                        Pinned Discussions
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {pinnedThreads.map((thread) => (
                        <div key={thread.id} className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <button
                                  onClick={() => router.push(`/forums/${forumSlug}/threads/${toThreadSlug(thread)}`)}
                                  className="text-lg font-semibold text-gray-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer text-left"
                                >
                                  {thread.title}
                                </button>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-slate-700 dark:text-amber-200">
                                  Pinned
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                                <Link
                                  href={`/profile/${thread.createdById}`}
                                  className="font-medium text-gray-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-300"
                                >
                                  {displayNameFor(thread.createdById)}
                                </Link>
                                <span>•</span>
                                <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {session?.user?.id &&
                              (thread.createdById === session.user.id ||
                                forum?.memberships?.some(
                                  (m) =>
                                    m.userId === session.user.id &&
                                    (m.role === "ADMIN" || m.role === "MODERATOR")
                                )) && (
                                <div className="flex items-center gap-2">
                                  {editingThreadId === thread.id ? (
                                    <>
                                      <button
                                        onClick={handleUpdateThread}
                                        className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={cancelEditThread}
                                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => startEditThread(thread)}
                                        className="px-3 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteThread(thread.id)}
                                        className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-xs"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                          </div>
                          {editingThreadId === thread.id ? (
                            <div className="space-y-2">
                              <input
                                className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                                value={editThreadTitle}
                                onChange={(e) => setEditThreadTitle(e.target.value)}
                              />
                              <textarea
                                className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm min-h-[100px]"
                                value={editThreadContent}
                                onChange={(e) => setEditThreadContent(e.target.value)}
                              />
                            </div>
                          ) : (
                            <p className="text-gray-700 dark:text-slate-300">{thread.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recentThreads.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MessageCircle className="h-5 w-5 text-gray-600 dark:text-slate-400" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                        Recent Discussions
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {recentThreads.map((thread) => (
                        <div key={thread.id} className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <button
                                onClick={() => router.push(`/forums/${forumSlug}/threads/${toThreadSlug(thread)}`)}
                                className="text-lg font-semibold text-gray-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer text-left mb-1"
                              >
                                {thread.title}
                              </button>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                                <Link
                                  href={`/profile/${thread.createdById}`}
                                  className="font-medium text-gray-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-300"
                                >
                                  {displayNameFor(thread.createdById)}
                                </Link>
                                <span>•</span>
                                <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {session?.user?.id &&
                              (thread.createdById === session.user.id ||
                                forum?.memberships?.some(
                                  (m) =>
                                    m.userId === session.user.id &&
                                    (m.role === "ADMIN" || m.role === "MODERATOR")
                                )) && (
                                <div className="flex items-center gap-2">
                                  {editingThreadId === thread.id ? (
                                    <>
                                      <button
                                        onClick={handleUpdateThread}
                                        className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={cancelEditThread}
                                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs"
                                      >
                                        Cancel
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => startEditThread(thread)}
                                        className="px-3 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteThread(thread.id)}
                                        className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-xs"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                          </div>
                          {editingThreadId === thread.id ? (
                            <div className="space-y-2">
                              <input
                                className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                                value={editThreadTitle}
                                onChange={(e) => setEditThreadTitle(e.target.value)}
                              />
                              <textarea
                                className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm min-h-[100px]"
                                value={editThreadContent}
                                onChange={(e) => setEditThreadContent(e.target.value)}
                              />
                            </div>
                          ) : (
                            <p className="text-gray-700 dark:text-slate-300">{thread.content}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700">
                    <MessageCircle className="h-12 w-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                      No Discussions Yet
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400">
                      Be the first to start a discussion!
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Members</h3>
                  <button
                    onClick={async () => {
                      const next = !showMembers;
                      setShowMembers(next);
                      if (next && members.length === 0) {
                        await refreshMembers();
                      }
                    }}
                    className="px-3 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs"
                  >
                    {showMembers ? "Hide" : "Show"}
                  </button>
                </div>
                {showMembers && (
                  <>
                    {membersLoading && <p className="text-sm text-gray-600 dark:text-slate-400">Loading members...</p>}
                    {membersError && <p className="text-sm text-red-600">{membersError}</p>}
                    {!membersLoading && members.length === 0 && (
                      <p className="text-sm text-gray-600 dark:text-slate-400">No members found.</p>
                    )}
                    {members.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {members.map((m) => (
                          <Link
                            key={m.id}
                            href={`/profile/${m.userId}`}
                            className="px-2 py-1 text-xs rounded bg-amber-50 dark:bg-slate-700 text-amber-800 dark:text-slate-200 border border-amber-200 dark:border-slate-600 hover:bg-amber-100 dark:hover:bg-slate-600 transition-colors"
                          >
                            {displayNameFor(m.userId)} ({m.role})
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6">
                <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">Forum Snapshot</div>
                <div className="text-xs text-gray-500 dark:text-slate-400">
                  Keep discussions on-topic, be respectful, and share helpful sources when possible.
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
