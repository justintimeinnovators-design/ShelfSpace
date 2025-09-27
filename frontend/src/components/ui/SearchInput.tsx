"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce, useDebouncedCallback } from "@/hooks/useDebounce";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  loading?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "filled";
}

export function SearchInput({
  placeholder = "Search...",
  onSearch,
  onClear,
  debounceMs = 300,
  loading = false,
  suggestions = [],
  onSuggestionSelect,
  className = "",
  size = "md",
  variant = "default"
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search
  const debouncedSearch = useDebouncedCallback(onSearch, debounceMs);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
    
    if (value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle clear
  const handleClear = () => {
    setQuery("");
    setShowSuggestions(false);
    onClear?.();
    inputRef.current?.focus();
  };

  // Handle suggestion select
  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
    onSearch(suggestion);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Size classes
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-5 text-lg"
  };

  // Variant classes
  const variantClasses = {
    default: "bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600",
    outline: "bg-transparent border-2 border-gray-300 dark:border-slate-600",
    filled: "bg-gray-100 dark:bg-slate-700 border border-transparent"
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            w-full rounded-lg pl-10 pr-10
            text-gray-900 dark:text-slate-100
            placeholder-gray-500 dark:placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
            transition-all duration-200
          `}
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionSelect(suggestion)}
              className="w-full px-4 py-2 text-left text-gray-900 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Advanced search with filters
interface AdvancedSearchProps {
  onSearch: (params: {
    query: string;
    filters: Record<string, any>;
  }) => void;
  filters?: Array<{
    key: string;
    label: string;
    type: "select" | "multiselect" | "range" | "date";
    options?: Array<{ value: string; label: string }>;
    min?: number;
    max?: number;
  }>;
  className?: string;
}

export function AdvancedSearch({
  onSearch,
  filters = [],
  className = ""
}: AdvancedSearchProps) {
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const debouncedSearch = useDebouncedCallback(
    (searchQuery: string, filters: Record<string, any>) => {
      onSearch({ query: searchQuery, filters });
    },
    300
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    debouncedSearch(value, filterValues);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    debouncedSearch(query, newFilters);
  };

  const clearFilters = () => {
    setFilterValues({});
    debouncedSearch(query, {});
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <SearchInput
        placeholder="Search books, authors, genres..."
        onSearch={handleQueryChange}
        className="w-full"
      />

      {/* Filter Toggle */}
      {filters.length > 0 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200"
        >
          <span>Filters</span>
          <div>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      )}

      {/* Filters */}
      {isExpanded && filters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                  {filter.label}
                </label>
                
                {filter.type === "select" && (
                  <select
                    value={filterValues[filter.key] || ""}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                  >
                    <option value="">All</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === "multiselect" && (
                  <div className="space-y-2">
                    {filter.options?.map((option) => (
                      <label key={option.value} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filterValues[filter.key]?.includes(option.value) || false}
                          onChange={(e) => {
                            const current = filterValues[filter.key] || [];
                            const newValue = e.target.checked
                              ? [...current, option.value]
                              : current.filter((v: string) => v !== option.value);
                            handleFilterChange(filter.key, newValue);
                          }}
                          className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-slate-300">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === "range" && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={filter.min}
                      max={filter.max}
                      value={filterValues[filter.key] || filter.min}
                      onChange={(e) => handleFilterChange(filter.key, parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 dark:text-slate-400">
                      {filterValues[filter.key] || filter.min}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
        </div>
      )}
    </div>
  );
}
