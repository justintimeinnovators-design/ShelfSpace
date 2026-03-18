"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { EnhancedButton } from "./EnhancedButton";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  illustration?: React.ReactNode;
  className?: string;
}

/**
 * Empty State.
 * @param {
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  illustration,
  className = "",
} - { icon: Icon, title, description, action Label, on Action, secondary Action Label, on Secondary Action, illustration, class Name = "", } value.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  illustration,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in-up ${className}`}
    >
      {/* Icon or Illustration */}
      <div className="mb-6 relative">
        {illustration ? (
          illustration
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-dye-500 rounded-full opacity-10 blur-2xl animate-pulse-scale" />
            <div className="relative bg-gradient-to-br from-indigo-dye-100 to-verdigris-100 dark:from-indigo-dye-900 dark:to-verdigris-900 p-8 rounded-full">
              <Icon className="w-16 h-16 text-indigo-dye-600 dark:text-indigo-dye-400" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        {description}
      </p>

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {actionLabel && onAction && (
            <EnhancedButton variant="primary" size="lg" onClick={onAction}>
              {actionLabel}
            </EnhancedButton>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <EnhancedButton
              variant="secondary"
              size="lg"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </EnhancedButton>
          )}
        </div>
      )}
    </div>
  );
};

// Preset empty states for common scenarios
/**
 * Empty Library.
 * @param {
  onAddBook,
} - { on Add Book, } value.
 */
export const EmptyLibrary: React.FC<{ onAddBook: () => void }> = ({
  onAddBook,
}) => {
  const { BookOpen } = require("lucide-react");
  return (
    <EmptyState
      icon={BookOpen}
      title="Your Library is Empty"
      description="Start building your personal library by adding your first book. Track your reading progress and discover new favorites."
      actionLabel="Add Your First Book"
      onAction={onAddBook}
      secondaryActionLabel="Browse Recommendations"
      onSecondaryAction={() => (window.location.href = "/discover")}
    />
  );
};

/**
 * Empty Reading List.
 * @param {
  onAddBooks,
} - { on Add Books, } value.
 */
export const EmptyReadingList: React.FC<{ onAddBooks: () => void }> = ({
  onAddBooks,
}) => {
  const { List } = require("lucide-react");
  return (
    <EmptyState
      icon={List}
      title="No Books in This List"
      description="This reading list is empty. Add books to organize your reading journey."
      actionLabel="Add Books"
      onAction={onAddBooks}
    />
  );
};

/**
 * Empty Forums.
 * @param {
  onCreateGroup,
} - { on Create Group, } value.
 */
export const EmptyForums: React.FC<{ onCreateGroup: () => void }> = ({
  onCreateGroup,
}) => {
  const { Users } = require("lucide-react");
  return (
    <EmptyState
      icon={Users}
      title="No Reading Forums Yet"
      description="Join or create a reading group to discuss books with fellow readers and share insights."
      actionLabel="Create a Group"
      onAction={onCreateGroup}
      secondaryActionLabel="Browse Forums"
      onSecondaryAction={() => (window.location.href = "/forums")}
    />
  );
};

/**
 * Empty Search.
 * @param { query } - { query } value.
 */
export const EmptySearch: React.FC<{ query: string }> = ({ query }) => {
  const { Search } = require("lucide-react");
  return (
    <EmptyState
      icon={Search}
      title="No Results Found"
      description={`We couldn't find any books matching "${query}". Try different keywords or browse our recommendations.`}
      actionLabel="Clear Search"
      onAction={() => (window.location.href = "/discover")}
    />
  );
};

/**
 * Empty Notifications.
 */
export const EmptyNotifications: React.FC = () => {
  const { Bell } = require("lucide-react");
  return (
    <EmptyState
      icon={Bell}
      title="No Notifications"
      description="You're all caught up! We'll notify you when there's something new."
    />
  );
};
