"use client";

import React from "react";

interface FilterControlsProps {
  filterGenre: string;
  onFilterGenreChange: (genre: string) => void;
  sortBy: "title" | "author" | "dateAdded" | "rating";
  onSortByChange: (sort: "title" | "author" | "dateAdded" | "rating") => void;
  genres: string[];
  filteredBooksCount: number;
}

/**
 * Filter Controls.
 * @param {
  filterGenre,
  onFilterGenreChange,
  sortBy,
  onSortByChange,
  genres,
  filteredBooksCount,
} - { filter Genre, on Filter Genre Change, sort By, on Sort By Change, genres, filtered Books Count, } value.
 */
export const FilterControls: React.FC<FilterControlsProps> = ({
  filterGenre,
  onFilterGenreChange,
  sortBy,
  onSortByChange,
  genres,
  filteredBooksCount,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Genre Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="genre-filter" className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Genre:
          </label>
          <select
            id="genre-filter"
            value={filterGenre}
            onChange={(e) => onFilterGenreChange(e.target.value)}
            className="
              px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-md
              bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100
              focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
              text-sm
            "
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sort-by" className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="
              px-3 py-1 border border-gray-300 dark:border-slate-600 rounded-md
              bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100
              focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
              text-sm
            "
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="dateAdded">Date Added</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-slate-400">
        {filteredBooksCount} book{filteredBooksCount !== 1 ? "s" : ""}
      </div>
    </div>
  );
};