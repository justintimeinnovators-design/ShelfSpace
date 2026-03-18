"use client";

import React from "react";
import { Grid3X3, List } from "lucide-react";

export type ViewMode = "grid" | "list";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

/**
 * View Mode Toggle.
 * @param {
  viewMode,
  onViewModeChange,
} - { view Mode, on View Mode Change, } value.
 */
export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange("grid")}
        className={`
          flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
          ${
            viewMode === "grid"
              ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 shadow-sm"
              : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"
          }
        `}
        aria-pressed={viewMode === "grid"}
        aria-label="Grid view"
      >
        <Grid3X3 className="h-4 w-4 mr-2" />
        Grid
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`
          flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
          ${
            viewMode === "list"
              ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-slate-100 shadow-sm"
              : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"
          }
        `}
        aria-pressed={viewMode === "list"}
        aria-label="List view"
      >
        <List className="h-4 w-4 mr-2" />
        List
      </button>
    </div>
  );
};