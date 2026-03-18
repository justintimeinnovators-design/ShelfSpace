"use client";

import { useState, useEffect, useCallback } from "react";
import { ViewMode, LibraryFilters } from "../../types/library";

interface LibraryPreferences {
  viewMode: ViewMode;
  selectedList: string;
  filters: Partial<LibraryFilters>;
}

const DEFAULT_PREFERENCES: LibraryPreferences = {
  viewMode: "grid",
  selectedList: "1",
  filters: {
    search: "",
    genre: null,
    status: null,
    sortBy: "title",
    sortOrder: "asc",
  },
};

/**
 * Use Library Preferences.
 */
export function useLibraryPreferences() {
  const [preferences, setPreferences] =
    useState<LibraryPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Update functions
  const updateViewMode = useCallback((viewMode: ViewMode) => {
    setPreferences((prev) => ({ ...prev, viewMode }));
  }, []);

  const updateSelectedList = useCallback((selectedList: string) => {
    setPreferences((prev) => ({ ...prev, selectedList }));
  }, []);

  const updateFilters = useCallback((filters: Partial<LibraryFilters>) => {
    setPreferences((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  const clearStoredPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  return {
    preferences,
    isLoaded,
    updateViewMode,
    updateSelectedList,
    updateFilters,
    resetPreferences,
    clearStoredPreferences,
  };
}
