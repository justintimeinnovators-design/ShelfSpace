"use client";

import { useState, useCallback, useMemo } from "react";
import { Book, LibraryFilters } from "../../types/library";

interface UseLibraryFiltersProps {
  books: Book[];
  initialFilters?: Partial<LibraryFilters>;
}

/**
 * Use Library Filters.
 * @param {
  books,
  initialFilters = {},
} - { books, initial Filters = {}, } value.
 */
export function useLibraryFilters({
  books,
  initialFilters = {},
}: UseLibraryFiltersProps) {
  const [filters, setFilters] = useState<LibraryFilters>({
    search: initialFilters.search || "",
    genre: initialFilters.genre || null,
    status: initialFilters.status || null,
    sortBy: initialFilters.sortBy || "title",
    sortOrder: initialFilters.sortOrder || "asc",
  });

  // Filter and sort books based on current filters
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower)
      );
    }

    // Apply genre filter
    if (filters.genre) {
      result = result.filter((book) => book.genres?.includes(filters.genre as string));
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((book) => {
        const bookStatus = (book as any).status;
        switch (filters.status) {
          case "reading":
            return bookStatus === "currently-reading" || bookStatus === "reading";
          case "completed":
            return bookStatus === "read" || bookStatus === "completed";
          case "want-to-read":
            return bookStatus === "want-to-read";
          default:
            return true;
        }
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "author":
          comparison = a.author.localeCompare(b.author);
          break;
        case "dateAdded":
          comparison =
            new Date((b as any).addedAt || (b as any).createdAt || "").getTime() -
            new Date((a as any).addedAt || (a as any).createdAt || "").getTime();
          break;
        case "rating":
          comparison = (b.rating || 0) - (a.rating || 0);
          break;
        default:
          comparison = 0;
      }

      return filters.sortOrder === "desc" ? -comparison : comparison;
    });

    return result;
  }, [books, filters]);

  // Available genres from the books
  const availableGenres = useMemo(() => {
    const genres = new Set(books.flatMap((book) => book.genres || []).filter(Boolean));
    return Array.from(genres).sort();
  }, [books]);

  // Filter update functions
  const updateSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const updateGenre = useCallback((genre: string | null) => {
    setFilters((prev) => ({ ...prev, genre }));
  }, []);

  const updateStatus = useCallback((status: LibraryFilters["status"]) => {
    setFilters((prev) => ({ ...prev, status }));
  }, []);

  const updateSortBy = useCallback((sortBy: LibraryFilters["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  }, []);

  const updateSortOrder = useCallback(
    (sortOrder: LibraryFilters["sortOrder"]) => {
      setFilters((prev) => ({ ...prev, sortOrder }));
    },
    []
  );

  const updateFilters = useCallback((newFilters: Partial<LibraryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      genre: null,
      status: null,
      sortBy: "title",
      sortOrder: "asc",
    });
  }, []);

  return {
    filters,
    filteredBooks,
    availableGenres,
    updateSearch,
    updateGenre,
    updateStatus,
    updateSortBy,
    updateSortOrder,
    updateFilters,
    resetFilters,
  };
}
