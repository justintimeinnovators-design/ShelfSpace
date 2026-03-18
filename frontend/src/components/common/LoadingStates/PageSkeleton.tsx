"use client";

import React from "react";
import {
  LibrarySkeleton,
  DashboardSkeleton,
  ChatSkeleton,
  DiscoverSkeleton,
  ForumsSkeleton,
  SettingsSkeleton,
} from "@/components/skeletons/SkeletonComponents";

interface PageSkeletonProps {
  variant: "library" | "dashboard" | "chat" | "discover" | "groups" | "forums" | "settings";
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({ variant }) => {
  switch (variant) {
    case "library":
      return <LibrarySkeleton />;
    case "dashboard":
      return <DashboardSkeleton />;
    case "chat":
      return <ChatSkeleton />;
    case "discover":
      return <DiscoverSkeleton />;
    case "groups":
    case "forums":
      return <ForumsSkeleton />;
    case "settings":
      return <SettingsSkeleton />;
    default:
      return <LibrarySkeleton />;
  }
};
