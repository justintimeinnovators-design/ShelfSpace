"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LibraryLoadingSkeleton } from "@/components/common/LoadingStates";
import { LibraryErrorFallback } from "@/components/common/ErrorFallbacks/LibraryErrorFallback";
import { useLibraryState } from "@/hooks/library/useLibraryState";
import LibrarySidebar from "./LibrarySidebar";
import LibraryHeader from "./LibraryHeader";
import BookGrid from "./BookGrid";
import BookList from "./BookList";
import { BookOpen } from "lucide-react";

/**
 * Props for the LibraryFeature component
 */
interface LibraryFeatureProps {
  /** URL search parameters for initializing library state */
  searchParams?: { [key: string]: string | string[] | undefined };
}

/**
 * LibraryFeature Component
 *
 * Main orchestrator component for the library feature. Manages the overall
 * library state, keyboard navigation, and coordinates between sidebar and
 * main content areas.
 *
 * Features:
 * - Reading list management and selection
 * - Book filtering, searching, and sorting
 * - Grid and list view modes
 * - Keyboard navigation support
 * - Error boundaries and loading states
 * - Responsive layout
 *
 * @example
 * ```tsx
 * // Basic usage
 * <LibraryFeature />
 *
 * // With URL search parameters
 * <LibraryFeature searchParams={{ list: "2", view: "list", search: "fiction" }} />
 * ```
 *
 * @param searchParams - URL search parameters for initializing state
 */
export function LibraryFeature({ searchParams }: LibraryFeatureProps) {
  const {
    selectedList,
    viewMode,
    filters,
    readingLists,
    selectedListData: currentList,
    filteredBooks,
    genres,
    isLoading,
    error,
    actions,
  } = useLibraryState(searchParams);

  const { search: searchQuery, genre: filterGenre, sortBy } = filters;

  // Create wrapper functions for filter updates
  const setSearchQuery = (search: string) => actions.updateFilters({ search });
  const setFilterGenre = (genre: string | null) => actions.updateFilters({ genre });
  const setSortBy = (sortBy: string) => actions.updateFilters({ sortBy });

  if (error) {
    throw error; // Let ErrorBoundary handle this
  }

  if (isLoading) {
    return <LibraryLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative z-10">
      <div className="relative flex h-screen">
        <aside role="complementary" aria-label="Library navigation">
          <LibrarySidebar
            readingLists={readingLists as any}
            selectedList={selectedList}
            setSelectedList={actions.setSelectedList}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </aside>

        {/* Main Content */}
        <main
          id="main-content"
          className="flex-1 flex flex-col"
          role="main"
          aria-label="Library content"
        >
          <header role="banner">
            <LibraryHeader
              currentList={currentList as any}
              viewMode={viewMode}
              setViewMode={actions.setViewMode}
              filterGenre={filterGenre || ""}
              setFilterGenre={setFilterGenre}
              sortBy={sortBy as "title" | "author" | "dateAdded" | "rating"}
              setSortBy={setSortBy}
              genres={genres as string[]}
              filteredBooksCount={filteredBooks.length}
            />
          </header>

          {/* Books Display */}
          <section
            className="flex-1 overflow-y-auto p-6"
            role="region"
            aria-label={`Books in ${currentList?.name || "library"}`}
            aria-live="polite"
          >
            {filteredBooks.length > 0 ? (
              viewMode === "grid" ? (
                <BookGrid books={filteredBooks as any} />
              ) : (
                <BookList books={filteredBooks as any} />
              )
            ) : (
              <div className="text-center py-12" role="status" aria-live="polite">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3 font-serif">
                  No Books Found
                </h3>
                <p className="text-lg text-gray-600 dark:text-slate-300 italic">
                  "A room without books is like a body without a soul." - Cicero
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                  Try adjusting your search or filters to find your next great read
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

// Wrapped version with error boundary for use in pages
export function LibraryFeatureWithBoundary({
  searchParams,
}: LibraryFeatureProps) {
  return (
    <ErrorBoundary fallback={LibraryErrorFallback}>
      <Suspense fallback={<LibraryLoadingSkeleton />}>
        <LibraryFeature {...(searchParams && { searchParams })} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default LibraryFeature;
