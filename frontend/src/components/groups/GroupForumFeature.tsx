"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Plus,
  Search,
  Pin,
  Eye,
  ThumbsUp,
  Reply,
  Calendar,
} from "lucide-react";
import { GroupChatFeature } from "./GroupChatFeature";
import { useGroup } from "@/hooks/data/useGroups";
import { useSession } from "next-auth/react";

interface GroupForumFeatureProps {
  groupId: string;
}

type TabType = "forum" | "chat";

export function GroupForumFeature({ groupId }: GroupForumFeatureProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { group, loading, error, isMember } = useGroup(groupId);
  const [activeTab, setActiveTab] = useState<TabType>("forum");

  // Check if current user is a member
  const userId = session?.user?.id || "";
  const userIsMember = isMember(userId);

  // Forum posts - keeping empty for now as there's no forum backend endpoint yet
  const forumPosts: any[] = [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6 animate-pulse">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Loading Group...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            {error ? "Error Loading Group" : "Group Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-slate-300 mb-6">
            {error || "The group you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.back()}
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
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-50 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Groups
        </button>

        {/* Group Header */}
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 font-serif mb-2">
                {group.name}
              </h1>
              <p className="text-gray-600 dark:text-slate-400 text-lg mb-4">
                {group.description || "No description available"}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-slate-400">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {group.memberships?.length || 0} members
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {forumPosts.length} discussions
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created {new Date(group.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {userIsMember ? (
                <button className="px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition-colors text-sm font-medium">
                  <Users className="h-4 w-4 mr-1 inline" />
                  Joined
                </button>
              ) : (
                <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm font-medium">
                  <Users className="h-4 w-4 mr-1 inline" />
                  Join Group
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-2 mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("forum")}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
                activeTab === "forum"
                  ? "bg-amber-500 text-white"
                  : "text-gray-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
              }`}
            >
              <MessageCircle className="h-4 w-4 inline mr-2" />
              Forum
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
                activeTab === "chat"
                  ? "bg-amber-500 text-white"
                  : "text-gray-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
              }`}
            >
              <MessageCircle className="h-4 w-4 inline mr-2" />
              Live Chat
            </button>
          </div>
        </div>

        {/* Chat Tab */}
        {activeTab === "chat" && userIsMember && (
          <div className="mb-8" style={{ height: "calc(100vh - 400px)", minHeight: "600px" }}>
            <GroupChatFeature groupId={groupId} groupName={group.name} />
          </div>
        )}
        {activeTab === "chat" && !userIsMember && (
          <div className="mb-8 text-center py-12 bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700">
            <MessageCircle className="h-12 w-12 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
              Join to Access Chat
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              You need to be a member of this group to access the chat.
            </p>
          </div>
        )}

        {/* Forum Tab */}
        {activeTab === "forum" && (
          <>
            {/* Forum Controls */}
            <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
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
                <button className="flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
                  <Plus className="h-4 w-4" />
                  New Discussion
                </button>
              </div>
            </div>

        {/* Forum Posts */}
        <div className="space-y-6">
            {/* Pinned Posts */}
          {forumPosts.filter(post => post.isPinned).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Pin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                Pinned Discussions
              </h2>
            </div>
            <div className="space-y-4">
              {forumPosts.filter(post => post.isPinned).map((post) => (
                <div key={post.id} className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {post.author.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <button
                              onClick={() => router.push(`/groups/${groupId}/posts/${post.id}`)}
                              className="text-lg font-semibold text-gray-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer text-left"
                            >
                              {post.title}
                            </button>
                            <Pin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                            <span className="font-medium text-gray-800 dark:text-slate-200">{post.author}</span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-slate-300 mb-4">
                        {post.content}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-amber-100 dark:bg-slate-700 text-amber-700 dark:text-slate-300 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-slate-400">
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.replies} replies
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {post.views} views
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {post.likes} likes
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-lg transition-colors text-sm">
                            <ThumbsUp className="h-4 w-4" />
                            Like
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-lg transition-colors text-sm">
                            <Reply className="h-4 w-4" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Regular Posts */}
          {forumPosts.filter(post => !post.isPinned).length > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-5 w-5 text-gray-600 dark:text-slate-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                Recent Discussions
              </h2>
            </div>
            <div className="space-y-4">
              {forumPosts.filter(post => !post.isPinned).map((post) => (
                <div key={post.id} className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {post.author.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <button
                            onClick={() => router.push(`/groups/${groupId}/posts/${post.id}`)}
                            className="text-lg font-semibold text-gray-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer text-left mb-1"
                          >
                            {post.title}
                          </button>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                            <span className="font-medium text-gray-800 dark:text-slate-200">{post.author}</span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-slate-300 mb-4">
                        {post.content}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-amber-100 dark:bg-slate-700 text-amber-700 dark:text-slate-300 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-slate-400">
                          <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {post.replies} replies
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {post.views} views
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {post.likes} likes
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-lg transition-colors text-sm">
                            <ThumbsUp className="h-4 w-4" />
                            Like
                          </button>
                          <button className="flex items-center gap-1 px-3 py-1 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-lg transition-colors text-sm">
                            <Reply className="h-4 w-4" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
          </>
        )}
      </div>
    </div>
  );
}