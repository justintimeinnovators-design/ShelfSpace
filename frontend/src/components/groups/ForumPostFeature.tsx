"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { useGroup } from "@/hooks/data/useGroups";

interface ForumPostFeatureProps {
  groupId: string;
  postId: string;
}

export function ForumPostFeature({ groupId, postId: _postId }: ForumPostFeatureProps) {
  const router = useRouter();
  const { group, loading: groupLoading, error: groupError } = useGroup(groupId);
  // Unused state for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_newComment, _setNewComment] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_replyingTo, _setReplyingTo] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_replyContent, _setReplyContent] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_showReplyForm, _setShowReplyForm] = useState<string | null>(null);

  if (groupLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6 animate-pulse">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Loading Discussion...
          </h2>
        </div>
      </div>
    );
  }

  if (groupError || !group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
            <MessageCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            {groupError ? "Error Loading Group" : "Group Not Found"}
          </h2>
          <p className="text-gray-600 dark:text-slate-300 mb-6">
            {groupError || "The group you're looking for doesn't exist."}
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

  // Note: Forum post rendering code removed since there's no backend endpoint yet
  // When forum backend is implemented, restore the rendering code here
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative z-10">
      <div className="relative container mx-auto px-4 py-8 z-20 max-w-4xl">
        <button
          onClick={() => router.push(`/groups/${groupId}`)}
          className="inline-flex items-center text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-50 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to {group.name}
        </button>
        <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 dark:border-slate-700 p-12 text-center">
          <MessageCircle className="h-16 w-16 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
            Forum Feature Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-slate-400">
            Forum posts are not yet available. This feature will be implemented soon.
          </p>
        </div>
      </div>
    </div>
  );
}
