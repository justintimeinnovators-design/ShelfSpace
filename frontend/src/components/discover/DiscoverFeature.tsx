"use client";

import { useState, useEffect, useCallback } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DiscoverErrorFallback } from "@/components/common/ErrorFallbacks/DiscoverErrorFallback";
import { bookService } from "@/lib/book-service";
import { BookCard } from "@/components/common/BookCard/BookCard";
import { BookListItem } from "@/components/library/components/BookListItem";
import { cn } from "@/utils/cn";
import { PageSkeleton } from "@/components/common/LoadingStates/PageSkeleton";
import { Book } from "@/types/book";
import { useDebounce } from "@/hooks/useDebounce";
import {
  BookOpen,
  Search,
  Grid,
  List,
  ArrowUpNarrowWide,
  ArrowDownNarrowWide,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type ViewMode = "grid" | "list";
type SortBy = "title" | "author" | "rating" | "publishedYear";
type SortOrder = "asc" | "desc";

export function DiscoverFeature() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);
  
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    totalPages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null>(null);

  // Fetch genres on mount
  useEffect(() => {
    bookService.getGenres()
      .then(setGenres)
      .catch((err) => console.error("Failed to fetch genres:", err));
  }, []);

  // Fetch books when filters change
  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await bookService.getBooks({
        page,
        ...(selectedGenre && { genre: selectedGenre }),
        ...(debouncedSearch && { search: debouncedSearch }),
        sortBy: sortOrder,
      });
      setBooks(result.data);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err?.message || "Failed to load books");
      console.error("Error fetching books:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedGenre, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Reset to page 1 when filters change (except page itself)
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre, debouncedSearch, sortBy, sortOrder]);

  if (isLoading && !books.length) {
    return <PageSkeleton variant="discover" />;
  }

  return (
    <ErrorBoundary fallback={DiscoverErrorFallback}>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative z-10">
        <div className="relative container mx-auto px-4 py-8 z-20">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-slate-100 mb-6 font-serif text-center">
            Discover Books
          </h1>
          <p className="text-xl text-gray-700 dark:text-slate-300 mb-10 text-center max-w-2xl mx-auto">
            Explore new worlds, find your next favorite read, and connect with stories that move you.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="flex-1 relative">
              <label htmlFor="book-search" className="sr-only">Search books</label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-slate-500" />
              <input
                id="book-search"
                name="book-search"
                type="text"
                placeholder="Search books, authors, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Genre Filter */}
            <div className="lg:w-48">
              <label htmlFor="genre-filter" className="sr-only">Filter by genre</label>
              <select
                id="genre-filter"
                name="genre-filter"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-3 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <label htmlFor="sort-by" className="sr-only">Sort books</label>
              <select
                id="sort-by"
                name="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-3 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="title">Sort by Title</option>
                <option value="author">Sort by Author</option>
                <option value="rating">Sort by Rating</option>
                <option value="publishedYear">Sort by Year</option>
              </select>
            </div>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-3 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 hover:bg-amber-50 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300 transition-colors flex items-center justify-center shadow-sm"
              aria-label={`Sort order: ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            >
              {sortOrder === "asc" ? (
                <ArrowUpNarrowWide className="h-5 w-5" />
              ) : (
                <ArrowDownNarrowWide className="h-5 w-5" />
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-3 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 hover:bg-amber-50 dark:hover:bg-slate-600 transition-colors shadow-sm",
                  viewMode === "grid" ? "bg-amber-100 dark:bg-slate-600 text-amber-700 dark:text-slate-100" : "text-gray-700 dark:text-slate-300"
                )}
                aria-label="View as grid"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-3 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 hover:bg-amber-50 dark:hover:bg-slate-600 transition-colors shadow-sm",
                  viewMode === "list" ? "bg-amber-100 dark:bg-slate-600 text-amber-700 dark:text-slate-100" : "text-gray-700 dark:text-slate-300"
                )}
                aria-label="View as list"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* All Books Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 font-serif mb-6 flex items-center">
              <BookOpen className="h-7 w-7 text-amber-600 mr-3" />
              {pagination ? `All Books (${pagination.total} total)` : "All Books"}
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {books.length === 0 && !isLoading ? (
              <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-amber-200 dark:border-slate-700">
                <p className="text-gray-600 dark:text-slate-400 text-lg">
                  No books found matching your criteria. Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {books.map(book => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {books.map(book => (
                      <BookListItem key={book.id} book={book} />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={!pagination.hasPrev || isLoading}
                      className={cn(
                        "px-4 py-2 rounded-lg border border-amber-200 dark:border-slate-600",
                        "bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100",
                        "hover:bg-amber-50 dark:hover:bg-slate-600 transition-colors",
                        "flex items-center gap-2",
                        (!pagination.hasPrev || isLoading) && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 dark:text-slate-300">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                    </div>

                    <button
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={!pagination.hasNext || isLoading}
                      className={cn(
                        "px-4 py-2 rounded-lg border border-amber-200 dark:border-slate-600",
                        "bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100",
                        "hover:bg-amber-50 dark:hover:bg-slate-600 transition-colors",
                        "flex items-center gap-2",
                        (!pagination.hasNext || isLoading) && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </ErrorBoundary>
  );
}
