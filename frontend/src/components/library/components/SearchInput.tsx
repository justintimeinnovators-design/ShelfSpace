"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Search Input.
 * @param {
  value,
  onChange,
  placeholder = "Search...",
} - { value, on Change, placeholder = "Search...", } value.
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
/**
 * Handle Change.
 * @param event - event value.
 */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400 dark:text-slate-500" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600
          rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100
          placeholder-gray-500 dark:placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
          transition-colors duration-200
        "
        aria-label="Search books"
      />
    </div>
  );
};