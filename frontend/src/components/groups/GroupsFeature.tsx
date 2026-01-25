"use client";

import React from "react";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PageSkeleton } from "@/components/common/LoadingStates/PageSkeleton";
import { Group } from "@/types/groups";
import { useGroups } from "@/hooks/data/useGroups";
import { GroupService, type GroupDTO } from "@/lib/group-service";
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
type SortBy = "name" | "memberCount" | "bookCount" | "createdAt";
type SortOrder = "asc" | "desc";

// Transform backend GroupDTO to frontend Group type
function transformGroup(dto: GroupDTO, currentUserId?: string): Group {
  const isJoined = currentUserId ? dto.memberships.some((m) => m.userId === currentUserId) : false;
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description || "",
    memberCount: dto.memberships.length,
    bookCount: 0, // Not available from backend yet
    isPublic: true, // Default, not in schema yet
    isJoined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    createdBy: dto.createdById,
    tags: [], // Not in schema yet
  };
}

export function GroupsFeature() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  // TODO: Implement debounced search functionality
  // const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("memberCount");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showJoinedOnly, setShowJoinedOnly] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");

  const { groups: groupsDTO, loading, error, refresh, createGroup } = useGroups();

  // Transform backend groups to frontend format
  const allGroups = useMemo(() => {
    return groupsDTO.map((dto) => transformGroup(dto, session?.user?.id));
  }, [groupsDTO, session?.user?.id]);

  const tags = useMemo(() => {
    const uniqueTags = new Set(allGroups.flatMap((group) => group.tags));
    return Array.from(uniqueTags).sort();
  }, [allGroups]);

  const filteredAndSortedGroups = useMemo(() => {
    let filtered = allGroups.filter((group: Group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (selectedTag) {
      filtered = filtered.filter((group: Group) => group.tags.includes(selectedTag));
    }

    if (showJoinedOnly) {
      filtered = filtered.filter((group: Group) => group.isJoined);
    }

    filtered.sort((a: Group, b: Group) => {
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
        case "bookCount":
          compareA = a.bookCount;
          compareB = b.bookCount;
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
  }, [allGroups, searchQuery, selectedTag, sortBy, sortOrder, showJoinedOnly]);

  const popularGroups = useMemo(() => {
    return allGroups
      .filter((group: Group) => group.memberCount >= 1000)
      .sort((a: Group, b: Group) => b.memberCount - a.memberCount)
      .slice(0, 3);
  }, [allGroups]);

  const handleJoinGroup = useCallback(
    async (groupId: string) => {
      try {
        await GroupService.join(groupId);
        refresh(); // Refresh to update membership status
      } catch (err: any) {
        console.error("Failed to join group:", err);
        alert(err?.response?.data?.error || "Failed to join group");
      }
    },
    [refresh]
  );

  const handleLeaveGroup = useCallback(
    async (groupId: string) => {
      try {
        await GroupService.leave(groupId);
        refresh(); // Refresh to update membership status
      } catch (err: any) {
        console.error("Failed to leave group:", err);
        alert(err?.response?.data?.error || "Failed to leave group");
      }
    },
    [refresh]
  );

  const handleViewGroup = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  const handleCreateGroup = useCallback(async () => {
    if (!newGroupName.trim()) {
      alert("Group name is required");
      return;
    }
    try {
      const trimmedDescription = newGroupDescription.trim();
      await createGroup({
        name: newGroupName.trim(),
        ...(trimmedDescription && { description: trimmedDescription }),
      });
      setShowCreateModal(false);
      setNewGroupName("");
      setNewGroupDescription("");
    } catch (err: any) {
      console.error("Failed to create group:", err);
      alert(err?.response?.data?.error || "Failed to create group");
    }
  }, [newGroupName, newGroupDescription, createGroup]);

  if (loading && allGroups.length === 0) {
    return <PageSkeleton variant="groups" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative z-10">
      <div className="relative container mx-auto px-4 py-8 z-20">
          {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-slate-100 mb-6 font-serif">
            Reading Groups
          </h1>
          <p className="text-xl text-gray-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Connect with fellow readers, share your thoughts, and discover new books through vibrant reading communities.
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{allGroups.length}</div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Active Groups</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {allGroups.reduce((sum, group) => sum + group.memberCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {allGroups.filter((g) => g.isJoined).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">Your Groups</div>
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
                  placeholder="Search groups, topics, or books..."
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
                <option value="bookCount-desc">Most Books</option>
                <option value="bookCount-asc">Least Books</option>
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
              <span className="text-sm text-gray-700 dark:text-slate-300">Show only joined groups</span>
            </label>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-slate-400">
            Showing {filteredAndSortedGroups.length} of {allGroups.length} groups
          </div>
        </div>

        {/* Popular Groups Section */}
        {popularGroups.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-serif">
                Popular Groups
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onJoin={handleJoinGroup}
                  onLeave={handleLeaveGroup}
                  onView={handleViewGroup}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Groups Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 font-serif">
              All Groups
            </h2>
            {session?.user ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Group
              </button>
            ) : (
              <p className="text-sm text-gray-600 dark:text-slate-400">Sign in to create a group</p>
            )}
          </div>

          {filteredAndSortedGroups.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
                No groups found
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Try adjusting your search criteria or create a new group.
              </p>
              <button className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
                Create Your First Group
              </button>
            </div>
          ) : (
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredAndSortedGroups.map((group) => (
                viewMode === "grid" ? (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onJoin={handleJoinGroup}
                    onLeave={handleLeaveGroup}
                    onView={handleViewGroup}
                  />
                ) : (
                  <GroupListItem
                    key={group.id}
                    group={group}
                    onJoin={handleJoinGroup}
                    onLeave={handleLeaveGroup}
                    onView={handleViewGroup}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Create New Group</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewGroupName("");
                  setNewGroupDescription("");
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="Describe your group (optional)"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  maxLength={255}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateGroup}
                  className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                  Create Group
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewGroupName("");
                    setNewGroupDescription("");
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

// Group Card Component
interface GroupCardProps {
  group: Group;
  onJoin: (groupId: string) => void;
  onLeave: (groupId: string) => void;
  onView: (groupId: string) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onJoin, onLeave, onView }) => {
  return (
    <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 font-serif mb-2">
            {group.name}
          </h3>
          <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            {group.description}
          </p>
        </div>
        {group.isJoined && (
          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-1 rounded-full">
            Joined
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-slate-400">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {group.memberCount.toLocaleString()} members
        </div>
        <div className="flex items-center">
          <BookOpen className="h-4 w-4 mr-1" />
          {group.bookCount} books
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {group.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-amber-100 dark:bg-slate-700 text-amber-700 dark:text-slate-300 text-xs rounded-full"
          >
            #{tag}
          </span>
        ))}
        {group.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-slate-400 text-xs rounded-full">
            +{group.tags.length - 3} more
          </span>
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-slate-500 mb-4">
        <div className="flex items-center mb-1">
          <MessageCircle className="h-3 w-3 mr-1" />
          Recent: {group.recentActivity}
        </div>
        {group.nextMeeting && (
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Next meeting: {new Date(group.nextMeeting).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {group.isJoined ? (
          <button
            onClick={() => onLeave(group.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg transition-colors text-sm font-medium"
          >
            <UserPlus className="h-4 w-4" />
            Leave Group
          </button>
        ) : (
          <button
            onClick={() => onJoin(group.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <UserPlus className="h-4 w-4" />
            Join Group
          </button>
        )}
        <button 
          onClick={() => onView(group.id)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded-lg transition-colors text-sm font-medium"
        >
          View Forum
        </button>
      </div>
    </div>
  );
};

// Group List Item Component
const GroupListItem: React.FC<GroupCardProps> = ({ group, onJoin, onLeave, onView }) => {
  return (
    <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg border border-amber-200 dark:border-slate-700 p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              {group.name}
            </h3>
            {group.isJoined && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-1 rounded-full">
                Joined
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
            {group.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {group.memberCount.toLocaleString()} members
            </div>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {group.bookCount} books
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Created {new Date(group.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {group.isJoined ? (
            <button
              onClick={() => onLeave(group.id)}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded text-sm font-medium transition-colors"
            >
              Leave
            </button>
          ) : (
            <button
              onClick={() => onJoin(group.id)}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-sm font-medium transition-colors"
            >
              Join
            </button>
          )}
          <button 
            onClick={() => onView(group.id)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 rounded text-sm font-medium transition-colors"
          >
            Forum
          </button>
        </div>
      </div>
    </div>
  );
};