"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, MessageCircle, ThumbsUp } from "lucide-react";
import { useForumPosts } from "@/hooks/data/useForumPosts";
import { type ForumPostDTO } from "@/lib/forum-service";
import { ThreadDetailSkeleton } from "@/components/skeletons/SkeletonComponents";
import apiClient from "@/lib/api";
import Link from "next/link";

interface ForumPostFeatureProps {
  forumId: string;
  threadId: string;
  forumSlug: string;
}

export function ForumPostFeature({ forumId, threadId, forumSlug }: ForumPostFeatureProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { thread, posts, loading, error, createPost, updatePost, deletePost, addReaction, removeReaction } =
    useForumPosts(forumId, threadId);
  const [newPostContent, setNewPostContent] = useState("");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [userProfiles, setUserProfiles] = useState<Record<string, { name?: string }>>({});
  const userProfilesRef = useRef<Record<string, { name?: string }>>({});

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      alert("Post content is required.");
      return;
    }
    await createPost(newPostContent.trim());
    setNewPostContent("");
  };

  const startEditPost = (post: ForumPostDTO) => {
    setEditingPostId(post.id);
    setEditPostContent(post.content);
  };

  const cancelEditPost = () => {
    setEditingPostId(null);
    setEditPostContent("");
  };

  const handleUpdatePost = async () => {
    if (!editingPostId) return;
    await updatePost(editingPostId, editPostContent.trim());
    cancelEditPost();
  };

  const handleDeletePost = async (postIdToDelete: string) => {
    const confirmed = window.confirm("Delete this post? This cannot be undone.");
    if (!confirmed) return;
    await deletePost(postIdToDelete);
  };

  const handleAddReaction = async (postIdToReact: string) => {
    await addReaction(postIdToReact, "LIKE");
  };

  const handleRemoveReaction = async (postIdToReact: string) => {
    await removeReaction(postIdToReact, "LIKE");
  };

  useEffect(() => {
    let cancelled = false;
    const fetchProfiles = async () => {
      const ids = new Set<string>();
      if (thread?.createdById) ids.add(thread.createdById);
      posts.forEach((post) => ids.add(post.authorId));
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
  }, [thread?.createdById, posts]);

  const displayNameFor = (profileUserId: string) => {
    const name = userProfiles[profileUserId]?.name;
    if (name) return name;
    return "Reader";
  };

  if (loading) {
    return <ThreadDetailSkeleton />;
  }

  if (error || !thread) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            {error ? "Error Loading Discussion" : "Discussion Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-slate-300 mb-6">
            {error || "The discussion you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.push(`/forums/${forumSlug}`)}
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
      <div className="relative container mx-auto px-4 py-8 z-20 max-w-4xl">
        <button
          onClick={() => router.push(`/forums/${forumSlug}`)}
          className="inline-flex items-center text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-50 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Forum
        </button>

        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            {thread.title}
          </h1>
          <p className="text-gray-700 dark:text-slate-300">{thread.content}</p>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-3">
            By{" "}
            <Link
              href={`/profile/${thread.createdById}`}
              className="font-medium text-amber-700 dark:text-amber-300 hover:text-amber-600"
            >
              {displayNameFor(thread.createdById)}
            </Link>{" "}
            • {new Date(thread.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Reply</h2>
          <textarea
            className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm min-h-[120px]"
            placeholder="Write a reply..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <button
            onClick={handleCreatePost}
            className="mt-3 px-4 py-2 rounded bg-amber-500 hover:bg-amber-600 text-white text-sm"
          >
            Post Reply
          </button>
        </div>

        <div className="space-y-4">
          {posts.length === 0 && (
            <div className="text-center py-12 bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700">
              <MessageCircle className="h-12 w-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                No Replies Yet
              </h3>
              <p className="text-gray-600 dark:text-slate-400">Be the first to reply!</p>
            </div>
          )}

          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    <Link
                      href={`/profile/${post.authorId}`}
                      className="font-medium text-amber-700 dark:text-amber-300 hover:text-amber-600"
                    >
                      {displayNameFor(post.authorId)}
                    </Link>{" "}
                    • {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {session?.user?.id && post.authorId === session.user.id && (
                  <div className="flex items-center gap-2">
                    {editingPostId === post.id ? (
                      <>
                        <button
                          onClick={handleUpdatePost}
                          className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditPost}
                          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditPost(post)}
                          className="px-3 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {editingPostId === post.id ? (
                <textarea
                  className="w-full px-3 py-2 rounded border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm min-h-[100px]"
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                />
              ) : (
                <p className="text-gray-800 dark:text-slate-200 whitespace-pre-wrap">{post.content}</p>
              )}

              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={() => handleAddReaction(post.id)}
                  className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>Like</span>
                </button>
                <button
                  onClick={() => handleRemoveReaction(post.id)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Remove Like
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
