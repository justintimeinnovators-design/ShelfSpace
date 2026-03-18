"use client";

import React from "react";
import { ReadingList } from "@/types/library";

interface ReadingListItemProps {
  list: ReadingList;
  isSelected: boolean;
  onSelect: (listId: string) => void;
}

/**
 * Reading List Item.
 * @param {
  list,
  isSelected,
  onSelect,
} - { list, is Selected, on Select, } value.
 */
export const ReadingListItem: React.FC<ReadingListItemProps> = ({
  list,
  isSelected,
  onSelect,
}) => {
/**
 * Handle Click.
 */
  const handleClick = () => {
    onSelect(list.id);
  };

/**
 * Handle Key Down.
 * @param event - event value.
 */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        w-full text-left p-3 rounded-lg transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
        ${
          isSelected
            ? "bg-amber-100 dark:bg-slate-700 text-amber-900 dark:text-slate-100 border border-amber-300 dark:border-slate-600"
            : "text-gray-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700/50 border border-transparent"
        }
      `}
      aria-pressed={isSelected}
      aria-label={`Select ${list.name} reading list`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{list.name}</h3>
          {list.description && (
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2">
              {list.description}
            </p>
          )}
        </div>
        <div className="ml-2 flex-shrink-0">
          <span
            className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${
                isSelected
                  ? "bg-amber-200 dark:bg-slate-600 text-amber-800 dark:text-slate-200"
                  : "bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-slate-300"
              }
            `}
          >
            {list.bookCount}
          </span>
        </div>
      </div>
    </button>
  );
};