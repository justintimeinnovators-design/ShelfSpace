/**
 * Library feature page component.
 *
 * Responsibilities:
 * - Render list-centric library overview.
 * - Coordinate creation of new reading lists.
 * - Bridge authenticated user identity into profile/list links.
 */
"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LibraryLoadingSkeleton } from "@/components/common/LoadingStates";
import { LibraryErrorFallback } from "@/components/common/ErrorFallbacks/LibraryErrorFallback";
import { useLibraryState } from "@/hooks/library/useLibraryState";
import { BookOpen, Plus, Library } from "lucide-react";
import { toListSlug } from "@/lib/slug";

/** Renders up to 4 stacked/fanned book covers for a reading list card. */
function CoverCollage({ books }: { books: any[] }) {
  const covers = books
    .map((b: any) => b.coverImage || b.cover || b.image_url || "")
    .filter(Boolean)
    .slice(0, 4);

  if (covers.length === 0) {
    return (
      <div className="w-full h-36 mb-5 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
        <BookOpen className="h-10 w-10 text-amber-400 dark:text-slate-400 opacity-60" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-36 mb-5 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-800 dark:to-slate-700">
      <div className="absolute inset-0 flex items-end justify-center gap-1.5 pb-3 px-4">
        {covers.map((src, i) => {
          const offsets = ["-rotate-6 translate-y-2", "-rotate-2 translate-y-1", "rotate-2 translate-y-1", "rotate-6 translate-y-2"];
          const zIndexes = ["z-10", "z-20", "z-20", "z-10"];
          return (
            <div
              key={i}
              className={`relative flex-shrink-0 w-16 h-24 rounded-md shadow-lg overflow-hidden transform transition-transform group-hover:scale-105 ${offsets[i] ?? ""} ${zIndexes[i] ?? ""}`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
      {/* Soft vignette at bottom */}
      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white/40 dark:from-slate-800/40 to-transparent pointer-events-none" />
    </div>
  );
}

/**
 * Props for the LibraryFeature component
 */
interface LibraryFeatureProps {
  /** URL search parameters for initializing library state */
  searchParams?: { [key: string]: string | string[] | undefined };
}

/**
 * Main library screen renderer.
 *
 * @param searchParams Optional URL params to seed library state.
 */
export function LibraryFeature({ searchParams }: LibraryFeatureProps) {
  const { data: session } = useSession();
  const [newListName, setNewListName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const {
    readingLists,
    isLoading,
    error,
    createReadingList,
  } = useLibraryState(searchParams);
  const usernameSlug = (session?.user?.name || session?.user?.email || "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (error) {
    throw error; // Let ErrorBoundary handle this
  }

  if (isLoading) {
    return <LibraryLoadingSkeleton />;
  }

  /**
   * Creates a new reading list from current input state.
   */
  const handleCreate = async () => {
    const trimmed = newListName.trim();
    if (!trimmed) return;
    setIsCreating(true);
    await createReadingList(trimmed);
    setNewListName("");
    setIsCreating(false);
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(71,85,105,0.25),transparent_50%)]">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-red-50/80 dark:from-slate-950/80 dark:via-slate-900/80 dark:to-slate-800/80" />
      <main className="relative container mx-auto px-4 py-12" role="main" aria-label="Library">
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700/80 dark:text-amber-300/80 font-semibold">
              Your Library
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 dark:text-slate-100 mt-3">
              Reading Lists
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-slate-300 mt-4 max-w-2xl">
              A shelf for every mood. Curate your collections and return to them anytime.
            </p>
          </div>
          {session?.user && (
            <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200/70 dark:border-slate-700 p-4 w-full lg:w-[360px]">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold mb-3">
                Create List
              </p>
              <div className="flex items-center gap-2">
                <input
                  value={newListName}
                  onChange={(event) => setNewListName(event.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="List name"
                />
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm"
                >
                  <Plus className="h-4 w-4" />
                  {isCreating ? "Saving..." : "Add"}
                </button>
              </div>
            </div>
          )}
        </div>

        {readingLists.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3 font-serif">
              No Reading Lists Yet
            </h3>
            <p className="text-gray-600 dark:text-slate-300">
              Create your first list to begin organizing your library.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {readingLists.map((list: any) => (
              <Link
                key={list.id}
                href={`/profile/${usernameSlug}/lists/${toListSlug(list)}?from=library`}
                className="group bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200/70 dark:border-slate-700 p-6 hover:-translate-y-1 transition-transform"
              >
                <CoverCollage books={list.books || []} />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold">
                    Reading List
                  </span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    {list.bookIds?.length || 0} books
                  </span>
                </div>
                <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-slate-100 mb-2">
                  {list.name}
                </h2>
                {list.description && (
                  <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-2">
                    {list.description}
                  </p>
                )}
                <div className="mt-4 text-sm text-amber-700 dark:text-amber-300 inline-flex items-center gap-2">
                  <Library className="h-4 w-4" />
                  Open list →
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/**
 * Error/Loading boundary wrapper for route-level usage.
 *
 * @param searchParams Optional URL params.
 */
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
