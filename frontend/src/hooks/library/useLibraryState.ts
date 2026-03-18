/**
 * Library state orchestration hook.
 *
 * This hook combines:
 * - server data (reading lists + books),
 * - persistent/shareable URL-derived state (list/view/filter),
 * - local interaction state (selected books),
 * into one interface for library screens.
 */
"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { LibraryState, LibraryActions } from "../../../types/state";
import { useReadingLists } from "../data/useReadingLists";
import { validateLibraryState } from "../../utils/stateValidation";
import { libraryService } from "@/services/libraryService";

const defaultFilters: LibraryState["filters"] = {
  search: "",
  genre: null,
  status: null,
  sortBy: "title",
  sortOrder: "asc",
};

const initialState: Omit<LibraryState, "isLoading" | "error"> = {
  selectedList: "",
  viewMode: "grid",
  filters: defaultFilters,
  selectedBooks: [],
};

/**
 * Creates and manages the complete library UI state model.
 *
 * @param searchParams Optional route search params used to seed initial state.
 * @returns State slices, derived data, and actions for library screens.
 */
export function useLibraryState(searchParams?: { [key: string]: string | string[] | undefined }) {
  const [state, setState] = useState<Omit<LibraryState, "isLoading" | "error">>(
    () => {
      // Seed UI state from URL so views are shareable/bookmarkable.
      if (searchParams) {
        const getParam = (key: string) => {
          const value = searchParams[key];
          return Array.isArray(value) ? value[0] : value;
        };
        
        return {
          ...initialState,
          selectedList: getParam("list") || initialState.selectedList,
          viewMode:
            (getParam("view") as "grid" | "list") ||
            initialState.viewMode,
          filters: {
            ...initialState.filters,
            search: getParam("search") || "",
            genre: getParam("genre") || null,
            status: getParam("status") || null,
          },
        };
      }
      return initialState;
    }
  );

  // Get reading lists data
  const {
    data: readingLists,
    isLoading,
    error,
    refetch: refetchReadingLists,
  } = useReadingLists({ includeBooks: true });

  // Public actions that mutate only local UI state (not server state).
  const setSelectedList = useCallback((listId: string) => {
    setState((prev) => ({ ...prev, selectedList: listId }));
  }, []);

  const setViewMode = useCallback((mode: "grid" | "list") => {
    try {
      // Guard invalid view-mode transitions before committing to state.
      validateLibraryState({ viewMode: mode });
      setState((prev) => ({ ...prev, viewMode: mode }));
    } catch (error) {
      console.error("Failed to set view mode:", error);
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters: Partial<LibraryState["filters"]>) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, ...newFilters },
      }));
    },
    []
  );

  const toggleBookSelection = useCallback((bookId: string) => {
    setState((prev) => ({
      ...prev,
      selectedBooks: prev.selectedBooks.includes(bookId)
        ? prev.selectedBooks.filter((id) => id !== bookId)
        : [...prev.selectedBooks, bookId],
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selectedBooks: [] }));
  }, []);

  const resetFilters = useCallback(() => {
    setState((prev) => ({ ...prev, filters: defaultFilters }));
  }, []);

  const actions = useMemo<LibraryActions>(
    () => ({
      setSelectedList,
      setViewMode,
      updateFilters,
      toggleBookSelection,
      clearSelection,
      resetFilters,
    }),
    [
      setSelectedList,
      setViewMode,
      updateFilters,
      toggleBookSelection,
      clearSelection,
      resetFilters,
    ]
  );

  // Derived values, memoized to keep render costs predictable.
  const selectedListData = useMemo(() => {
    return readingLists?.find((list) => list.id === state.selectedList);
  }, [readingLists, state.selectedList]);

  useEffect(() => {
    // Auto-select first list whenever selected list is missing/invalid.
    if (!readingLists || readingLists.length === 0) return;
    if (state.selectedList && readingLists.some((list) => list.id === state.selectedList)) {
      return;
    }
    setState((prev) => ({
      ...prev,
      selectedList: readingLists[0]?.id || "",
    }));
  }, [readingLists, state.selectedList]);

  const filteredBooks = useMemo(() => {
    if (!selectedListData?.books) return [];

    // Work on a copy so source list state remains immutable.
    let filtered = [...selectedListData.books];

    // Apply search filter
    if (state.filters.search) {
      const searchTerm = state.filters.search.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
      );
    }

    // Apply genre filter
    if (state.filters.genre) {
      filtered = filtered.filter((book) =>
        book.genres?.includes(state.filters.genre as any)
      );
    }

    // Apply status filter
    if (state.filters.status) {
      filtered = filtered.filter(
        (book) => book.status === state.filters.status
      );
    }

    // Sorting is done last so it applies to the final filtered set.
    filtered.sort((a, b) => {
      const aValue = a[state.filters.sortBy as keyof typeof a] || "";
      const bValue = b[state.filters.sortBy as keyof typeof b] || "";

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return state.filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [selectedListData, state.filters]);

  // Build global genre list for filter controls from all loaded lists.
  const genres = useMemo(() => {
    if (!readingLists) return [];
    const allBooks = readingLists.flatMap(list => list.books || []);
    const uniqueGenres = new Set(allBooks.flatMap(book => book.genres || []));
    return Array.from(uniqueGenres).sort();
  }, [readingLists]);

  const createReadingList = useCallback(async (name: string) => {
    const trimmed = name.trim();
    // Ignore empty input to avoid accidental blank lists.
    if (!trimmed) return;
    // Persist to backend then refresh query data for consistency.
    await libraryService.createReadingList({ list: { name: trimmed } });
    await refetchReadingLists();
  }, [refetchReadingLists]);

  return {
    // State
    selectedList: state.selectedList,
    viewMode: state.viewMode,
    filters: state.filters,
    selectedBooks: state.selectedBooks,
    isLoading,
    error,

    // Data
    readingLists: readingLists || [],
    selectedListData,
    filteredBooks,
    genres,

    // Actions
    actions,
    createReadingList,
  };
}
