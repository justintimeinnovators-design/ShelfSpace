/**
 * Forums index/landing feature.
 *
 * Provides search/filter/sort/view controls and forum discovery actions.
 * Keeps backend DTO mapping encapsulated in this layer.
 */
"use client";

import React from "react";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PageSkeleton } from "@/components/common/LoadingStates/PageSkeleton";
import { Forum } from "@/types/forums";
import { useForums } from "@/hooks/data/useForums";
import { type ForumDTO } from "@/lib/forum-service";
import { useDebounce } from "@/hooks/useDebounce";
import { toForumSlug } from "@/lib/slug";
import {
  Users,
  Search,
  Plus,
  MessageCircle,
  Calendar,
  UserPlus,
  BookOpen,
  TrendingUp,
  Grid,
  List,
  Clock,
  X,
} from "lucide-react";

type ViewMode = "grid" | "list";
type SortBy = "name" | "memberCount" | "threadCount" | "createdAt";
type SortOrder = "asc" | "desc";

/**
 * Maps backend forum DTO into frontend forum view model.
 */
function transformForum(dto: ForumDTO, currentUserId?: string): Forum {
  const isJoined = currentUserId ? dto.memberships.some((m) => m.userId === currentUserId) : false;
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description || "",
    memberCount: dto.memberships.length,
    threadCount: dto.threadCount ?? 0,
    isPublic: dto.isPublic,
    isJoined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    createdBy: dto.createdById,
    tags: dto.tags || [],
  };
}

/**
 * Forums exploration screen with discovery and membership actions.
 */
export function ForumsFeature() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("memberCount");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showJoinedOnly, setShowJoinedOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newForumName, setNewForumName] = useState("");
  const [newForumDescription, setNewForumDescription] = useState("");

  const { forums: forumsDTO, loading, error, createForum, joinForum, leaveForum } = useForums();

  // Normalize backend shape once, then perform all view computations on normalized list.
  const allForums = useMemo(() => {
    return forumsDTO.map((dto) => transformForum(dto, session?.user?.id));
  }, [forumsDTO, session?.user?.id]);

  const tags = useMemo(() => {
    const uniqueTags = new Set(allForums.flatMap((forum) => forum.tags));
    return Array.from(uniqueTags).sort();
  }, [allForums]);

  const filteredAndSortedForums = useMemo(() => {
    // Apply text and tag filters before sort for predictable UX.
    const normalizedSearch = debouncedSearch.toLowerCase();
    let filtered = allForums.filter((forum: Forum) =>
      forum.name.toLowerCase().includes(normalizedSearch) ||
      forum.description.toLowerCase().includes(normalizedSearch) ||
      forum.tags.some(tag => tag.toLowerCase().includes(normalizedSearch))
    );

    if (selectedTag) {
      filtered = filtered.filter((forum: Forum) => forum.tags.includes(selectedTag));
    }

    if (showJoinedOnly) {
      filtered = filtered.filter((forum: Forum) => forum.isJoined);
    }

    filtered.sort((a: Forum, b: Forum) => {
      let compareA: any;
      let compareB: any;

      switch (sortBy) {
        case "name":
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
          break;
        case "memberCount":
          compareA = a.memberCount;
          compareB = b.memberCount;
          break;
        case "threadCount":
          compareA = a.threadCount;
          compareB = b.threadCount;
          break;
        case "createdAt":
          compareA = new Date(a.createdAt).getTime();
          compareB = new Date(b.createdAt).getTime();
          break;
        default:
          compareA = a.memberCount;
          compareB = b.memberCount;
      }

      if (compareA < compareB) return sortOrder === "asc" ? -1 : 1;
      if (compareA > compareB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allForums, debouncedSearch, selectedTag, sortBy, sortOrder, showJoinedOnly]);

  const popularForums = useMemo(() => {
    // "Popular" is currently membership-count based and intentionally conservative.
    return allForums
      .filter((forum: Forum) => forum.memberCount >= 1000)
      .sort((a: Forum, b: Forum) => b.memberCount - a.memberCount)
      .slice(0, 3);
  }, [allForums]);

  const handleJoinForum = useCallback(
    async (forumId: string) => {
      try {
        await joinForum(forumId);
      } catch (err: any) {
        console.error("Failed to join forum:", err);
        alert(err?.response?.data?.error || "Failed to join forum");
      }
    },
    [joinForum]
  );

  const handleLeaveForum = useCallback(
    async (forumId: string) => {
      try {
        await leaveForum(forumId);
      } catch (err: any) {
        console.error("Failed to leave forum:", err);
        alert(err?.response?.data?.error || "Failed to leave forum");
      }
    },
    [leaveForum]
  );

  /**
   * Navigates to the selected forum detail route.
   */
  const handleViewForum = (forumId: string) => {
    const forum = allForums.find((f) => f.id === forumId);
    if (forum) {
      router.push(`/forums/${toForumSlug(forum)}`);
    } else {
      router.push(`/forums/${forumId}`);
    }
  };

  const handleCreateForum = useCallback(async () => {
    if (!newForumName.trim()) {
      alert("Forum name is required");
      return;
    }
    try {
      const trimmedDescription = newForumDescription.trim();
      await createForum({
        name: newForumName.trim(),
        ...(trimmedDescription && { description: trimmedDescription }),
      });
      setShowCreateModal(false);
      setNewForumName("");
      setNewForumDescription("");
    } catch (err: any) {
      console.error("Failed to create forum:", err);
      alert(err?.response?.data?.error || "Failed to create forum");
    }
  }, [newForumName, newForumDescription, createForum]);

  if (loading && allForums.length === 0) {
    return <PageSkeleton variant="forums" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative z-10">
      <div className="relative container mx-auto px-4 py-8 z-20">
          {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-slate-100 mb-6 font-serif">
            Reading Forums
          </h1>
          <p className="text-xl text-gray-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Connect with fellow readers, share your thoughts, and discover new books through vibrant reading communities.
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{allForums.length}</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Active Forums</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {allForums.reduce((sum, forum) => sum + forum.memberCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {allForums.filter((g) => g.isJoined).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Your Forums</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search forums, topics, or threads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tag Filter */}
            <div className="lg:w-48">
              <select
                value={selectedTag || ""}
                onChange={(e) => setSelectedTag(e.target.value || null)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">All Topics</option>
                {tags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field as SortBy);
                  setSortOrder(order as SortOrder);
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="memberCount-desc">Most Members</option>
                <option value="memberCount-asc">Least Members</option>
                <option value="threadCount-desc">Most Threads</option>
                <option value="threadCount-asc">Least Threads</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="createdAt-desc">Newest</option>
                <option value="createdAt-asc">Oldest</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-amber-500 text-white"
                    : "bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-500"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-amber-500 text-white"
                    : "bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-500"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap gap-4 mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showJoinedOnly}
                onChange={(e) => setShowJoinedOnly(e.target.checked)}
                className="mr-2 rounded border-gray-300 dark:border-slate-600 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700 dark:text-slate-300">Show only joined forums</span>
            </label>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-slate-400">
            Showing {filteredAndSortedForums.length} of {allForums.length} forums
          </div>
        </div>

        {/* Popular Forums Section */}
        {popularForums.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-serif">
                Popular Forums
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularForums.map((forum) => (
                <ForumCard
                  key={forum.id}
                  forum={forum}
                  onJoin={handleJoinForum}
                  onLeave={handleLeaveForum}
                  onView={handleViewForum}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Forums Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-serif">
              All Forums
            </h2>
            {session?.user ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Forum
              </button>
            ) : (
              <p className="text-sm text-gray-600 dark:text-slate-400">Sign in to create a forum</p>
            )}
          </div>

          {filteredAndSortedForums.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
                No forums found
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Try adjusting your search criteria or create a new forum.
              </p>
              <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
                Create Your First Forum
              </button>
            </div>
          ) : (
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredAndSortedForums.map((forum) => (
                viewMode === "grid" ? (
                  <ForumCard
                    key={forum.id}
                    forum={forum}
                    onJoin={handleJoinForum}
                    onLeave={handleLeaveForum}
                    onView={handleViewForum}
                  />
                ) : (
                  <ForumListItem
                    key={forum.id}
                    forum={forum}
                    onJoin={handleJoinForum}
                    onLeave={handleLeaveForum}
                    onView={handleViewForum}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Forum Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Create New Forum</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewForumName("");
                  setNewForumDescription("");
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Forum Name *
                </label>
                <input
                  type="text"
                  value={newForumName}
                  onChange={(e) => setNewForumName(e.target.value)}
                  placeholder="Enter forum name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newForumDescription}
                  onChange={(e) => setNewForumDescription(e.target.value)}
                  placeholder="Describe your forum (optional)"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  maxLength={255}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateForum}
                  className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                  Create Forum
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewForumName("");
                    setNewForumDescription("");
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Forum Card Component
interface ForumCardProps {
  forum: Forum;
  onJoin: (forumId: string) => void;
  onLeave: (forumId: string) => void;
  onView: (forumId: string) => void;
}

/**
 * Forum Card.
 * @param { forum, onJoin, onLeave, onView } - { forum, on Join, on Leave, on View } value.
 */
const ForumCard: React.FC<ForumCardProps> = ({ forum, onJoin, onLeave, onView }) => {
  return (
    <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 font-serif mb-2">
            {forum.name}
          </h3>
          <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            {forum.description}
          </p>
        </div>
        {forum.isJoined && (
          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-1 rounded-full">
            Joined
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-slate-400">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {forum.memberCount.toLocaleString()} members
        </div>
        <div className="flex items-center">
          <BookOpen className="h-4 w-4 mr-1" />
          {forum.threadCount} books
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {forum.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-amber-100 dark:bg-slate-700 text-amber-700 dark:text-slate-300 text-xs rounded-full"
          >
            #{tag}
          </span>
        ))}
        {forum.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-slate-400 text-xs rounded-full">
            +{forum.tags.length - 3} more
          </span>
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-slate-500 mb-4">
        <div className="flex items-center mb-1">
          <MessageCircle className="h-3 w-3 mr-1" />
          Recent: {forum.recentActivity}
        </div>
        {forum.nextMeeting && (
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Next meeting: {new Date(forum.nextMeeting).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {forum.isJoined ? (
          <button
            onClick={() => onLeave(forum.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg transition-colors text-sm font-medium"
          >
            <UserPlus className="h-4 w-4" />
            Leave Forum
          </button>
        ) : (
          <button
            onClick={() => onJoin(forum.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <UserPlus className="h-4 w-4" />
            Join Forum
          </button>
        )}
        <button 
          onClick={() => onView(forum.id)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-lg transition-colors text-sm font-medium"
        >
          View Forum
        </button>
      </div>
    </div>
  );
};

// Forum List Item Component
/**
 * Forum List Item.
 * @param { forum, onJoin, onLeave, onView } - { forum, on Join, on Leave, on View } value.
 */
const ForumListItem: React.FC<ForumCardProps> = ({ forum, onJoin, onLeave, onView }) => {
  return (
    <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg border border-amber-200 dark:border-slate-700 p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              {forum.name}
            </h3>
            {forum.isJoined && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-1 rounded-full">
                Joined
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
            {forum.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {forum.memberCount.toLocaleString()} members
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {forum.threadCount} books
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Created {new Date(forum.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {forum.isJoined ? (
            <button
              onClick={() => onLeave(forum.id)}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded text-sm font-medium transition-colors"
            >
              Leave
            </button>
          ) : (
            <button
              onClick={() => onJoin(forum.id)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-sm font-medium transition-colors"
            >
              Join
            </button>
          )}
          <button 
            onClick={() => onView(forum.id)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded text-sm font-medium transition-colors"
          >
            Forum
          </button>
        </div>
      </div>
    </div>
  );
};
