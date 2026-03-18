"use client";

import React from "react";
import { Users, Clock, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export interface Forum {
  id: string;
  name: string;
  memberCount: number;
  lastActivity: string;
  currentBook?: string;
  coverImage?: string;
  description?: string;
  genre?: string;
  isPrivate?: boolean;
  isJoined?: boolean;
}

interface ForumCardProps {
  forum: Forum;
  variant?: "dashboard" | "forums";
  onForumClick: (forumId: string) => void;
  onJoinForum?: (forumId: string) => void;
  className?: string;
  cardIndex?: number;
}

/**
 * Forum Card.
 * @param {
  forum,
  variant = "forums",
  onForumClick,
  onJoinForum,
  className = "",
} - { forum, variant = "forums", on Forum Click, on Join Forum, class Name = "", } value.
 */
const ForumCard: React.FC<ForumCardProps> = ({
  forum,
  variant = "forums",
  onForumClick,
  onJoinForum,
  className = "",
}) => {
  const isDashboard = variant === "dashboard";

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer ${className}`}
      padding={isDashboard ? "sm" : "md"}
      shadow="sm"
      hover
      interactive
      onClick={() => onForumClick(forum.id)}
    >
      <div
        className={`flex items-start ${
          isDashboard ? "space-x-3" : "space-x-4"
        }`}
      >
        {/* Forum Avatar */}
        <div className="flex-shrink-0">
          {forum.coverImage ? (
            <div
              className={`relative ${isDashboard ? "w-12 h-12" : "w-16 h-16"}`}
            >
              <Image
                src={forum.coverImage}
                alt={`${forum.name} forum cover`}
                fill
                className="object-cover rounded-lg"
                sizes={isDashboard ? "48px" : "64px"}
              />
            </div>
          ) : (
            <div
              className={`${
                isDashboard ? "w-12 h-12" : "w-16 h-16"
              } bg-gradient-to-br from-indigo-dye-100 to-safety-orange-100 rounded-lg flex items-center justify-center`}
            >
              <Users
                className={`${
                  isDashboard ? "h-6 w-6" : "h-8 w-8"
                } text-indigo-dye-600`}
              />
            </div>
          )}
        </div>

        {/* Forum Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div
                className={`flex items-center space-x-2 ${
                  isDashboard ? "" : "mb-1"
                }`}
              >
                <h3
                  className={`${
                    isDashboard ? "text-sm" : "text-lg"
                  } font-semibold text-gray-900 truncate`}
                >
                  {forum.name}
                </h3>
                {forum.isPrivate && (
                  <Badge variant="warning" size="sm">
                    Private
                  </Badge>
                )}
                {forum.isJoined && (
                  <Badge variant="success" size="sm">
                    Joined
                  </Badge>
                )}
              </div>

              {!isDashboard && forum.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {forum.description}
                </p>
              )}

              <div
                className={`flex items-center space-x-4 text-xs text-gray-500 ${
                  isDashboard ? "mt-1" : "mb-3"
                }`}
              >
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {forum.memberCount} members
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {forum.lastActivity}
                </div>
                {!isDashboard && forum.genre && (
                  <Badge variant="primary" size="sm">
                    {forum.genre}
                  </Badge>
                )}
              </div>

              {forum.currentBook && (
                <p
                  className={`${
                    isDashboard
                      ? "text-xs text-gray-600 mt-2 truncate"
                      : "text-sm text-gray-700"
                  }`}
                >
                  <span className="font-medium">Currently reading:</span>{" "}
                  {forum.currentBook}
                </p>
              )}
            </div>

            <ChevronRight
              className={`${
                isDashboard ? "h-4 w-4" : "h-5 w-5"
              } text-gray-400 flex-shrink-0 ml-2`}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      {!isDashboard && !forum.isJoined && onJoinForum && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onJoinForum(forum.id);
            }}
            variant="primary"
            fullWidth
          >
            Join Forum
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ForumCard;
