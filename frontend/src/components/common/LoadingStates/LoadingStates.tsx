"use client";

import React from "react";
import { PageSkeleton } from "./PageSkeleton";

// Generic loading spinner with message
/**
 * Loading Spinner.
 * @param { message - { message value.
 */
export const LoadingSpinner: React.FC<{
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ message: _message = "Loading...", size = "md", className }) => {
  const sizeMap = { sm: "h-4 w-24", md: "h-6 w-32", lg: "h-8 w-40" };
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 gap-3 ${className}`}
    >
      <div className={`animate-pulse bg-amber-100 dark:bg-slate-700 rounded-lg ${sizeMap[size]}`} />
      <div className="h-3 w-20 animate-pulse bg-amber-50 dark:bg-slate-600 rounded" />
    </div>
  );
};

// Page loading overlay
/**
 * Page Loading Overlay.
 * @param {
  message = "Loading page...",
} - { message = "Loading page...", } value.
 */
export const PageLoadingOverlay: React.FC<{ message?: string }> = ({
  message: _message = "Loading page...",
}) => {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-64 space-y-4 animate-pulse">
        <div className="h-8 bg-amber-100 dark:bg-slate-700 rounded-lg w-3/4 mx-auto" />
        <div className="h-4 bg-amber-50 dark:bg-slate-600 rounded w-1/2 mx-auto" />
        <div className="h-4 bg-amber-50 dark:bg-slate-600 rounded w-2/3 mx-auto" />
      </div>
    </div>
  );
};

// Library loading skeleton
/**
 * Library Loading Skeleton.
 */
export const LibraryLoadingSkeleton: React.FC = () => (
  <PageSkeleton variant="library" />
);

// Dashboard loading skeleton
/**
 * Dashboard Loading Skeleton.
 */
export const DashboardLoadingSkeleton: React.FC = () => (
  <PageSkeleton variant="dashboard" />
);

// Chat loading skeleton
/**
 * Chat Loading Skeleton.
 */
export const ChatLoadingSkeleton: React.FC = () => (
  <PageSkeleton variant="chat" />
);

// Discover loading skeleton
/**
 * Discover Loading Skeleton.
 */
export const DiscoverLoadingSkeleton: React.FC = () => (
  <PageSkeleton variant="discover" />
);

// Groups loading skeleton
/**
 * Groups Loading Skeleton.
 */
export const GroupsLoadingSkeleton: React.FC = () => (
  <PageSkeleton variant="groups" />
);

// Settings loading skeleton
/**
 * Settings Loading Skeleton.
 */
export const SettingsLoadingSkeleton: React.FC = () => (
  <PageSkeleton variant="settings" />
);
