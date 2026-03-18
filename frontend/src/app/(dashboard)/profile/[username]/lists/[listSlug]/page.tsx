"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { libraryService } from "@/services/libraryService";
import { ReadingList } from "@/types/library";
import { Book } from "@/types/book";
import { BookCard } from "@/components/common/BookCard";
import { bookService } from "@/lib/book-service";
import { BookOpen, Plus, Search } from "lucide-react";
import { parseListSlug } from "@/lib/slug";

export default function ReadingListDetailPage() {
  return (
    <Suspense>
      <ReadingListDetail />
    </Suspense>
  );
}

function ReadingListDetail() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const listSlug = Array.isArray(params['listSlug']) ? params['listSlug'][0] : params['listSlug'];
  const username = Array.isArray(params['username']) ? params['username'][0] : params['username'];
  const listId = listSlug ? parseListSlug(listSlug) : "";
  const backHref = searchParams.get("from") === "library" ? "/library" : `/profile/${username}`;
  const [list, setList] = useState<ReadingList | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [addingIds, setAddingIds] = useState<Set<string>>(new Set());
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadList = async () => {
      if (!listId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await libraryService.getReadingList(listId, true);
        if (!isMounted) return;
        setList(response.data as any);
        setBooks((response.data as any)?.books || []);
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Failed to load reading list");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadList();
    return () => {
      isMounted = false;
    };
  }, [listId]);

  const runSearch = async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setSearching(true);
    setAddError(null);
    try {
      const result = await bookService.searchBooks(trimmed, 1);
      setSearchResults(result.data || []);
    } catch (err: any) {
      setAddError(err?.message || "Failed to search books");
    } finally {
      setSearching(false);
    }
  };

  const addBookToList = async (bookId: string) => {
    if (!listId) return;
    setAddingIds((prev) => new Set(prev).add(bookId));
    try {
      await libraryService.addBooksToReadingList(listId, [bookId]);
      const found = searchResults.find((item) => item.id === bookId);
      if (found && !books.some((b) => b.id === found.id)) {
        setBooks((prev) => [...prev, found]);
      }
      const response = await libraryService.getReadingList(listId, true);
      setList(response.data as any);
      setBooks((response.data as any)?.books || []);
    } catch (err: any) {
      setAddError(err?.message || "Failed to add book");
    } finally {
      setAddingIds((prev) => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(71,85,105,0.25),transparent_50%)]">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/80 to-red-50/80 dark:from-slate-950/80 dark:via-slate-900/80 dark:to-slate-800/80" />
      <div className="relative container mx-auto px-4 py-12">
        <button
          onClick={() => router.push(backHref)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 border border-amber-200/70 dark:border-slate-700 text-amber-700 dark:text-amber-200 text-sm mb-6"
        >
          Back
        </button>

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-700/80 dark:text-amber-300/80 font-semibold">
            {username || "Profile"} / Reading List
          </p>
          <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-semibold text-gray-900 dark:text-slate-100">
                {list?.name || "Reading List"}
              </h1>
              <p className="text-base text-gray-600 dark:text-slate-300 mt-4 max-w-2xl">
                {list?.description || "A dedicated shelf for this slice of your library."}
              </p>
              <div className="mt-4 text-sm text-gray-600 dark:text-slate-400">
                {list?.bookIds?.length || 0} books
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Books
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-amber-200/70 dark:border-slate-700 p-4 shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold">
              Books
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mt-2">
              {list?.bookIds?.length || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-400">Titles in this list</p>
          </div>
          <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-amber-200/70 dark:border-slate-700 p-4 shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold">
              Updated
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mt-2">
              {list?.updatedAt ? new Date(list.updatedAt).toLocaleDateString() : "—"}
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-400">Last refreshed</p>
          </div>
          <div className="bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl border border-amber-200/70 dark:border-slate-700 p-4 shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-300/80 font-semibold">
              Curator
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-slate-100 mt-2">
              {username || "Reader"}
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-400">Shelf owner</p>
          </div>
        </div>

        {loading && (
          <div className="text-sm text-gray-600 dark:text-slate-400">Loading list...</div>
        )}

        {error && (
          <div className="bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-6">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3 font-serif">
              No Books Yet
            </h3>
            <p className="text-gray-600 dark:text-slate-300">
              This reading list is waiting for its first title.
            </p>
          </div>
        )}

        {books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} showSave={false} />
            ))}
          </div>
        )}

        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-amber-200/70 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-slate-100">
                  Add Books to {list?.name}
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-sm text-gray-500 dark:text-slate-400"
                >
                  Close
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") runSearch();
                    }}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-amber-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Search books by title or author"
                  />
                </div>
                <button
                  onClick={runSearch}
                  disabled={searching}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-sm"
                >
                  {searching ? "Searching..." : "Search"}
                </button>
              </div>

              {addError && <p className="text-sm text-red-600 mb-3">{addError}</p>}

              <div className="max-h-[360px] overflow-y-auto space-y-3">
                {searchResults.length === 0 && !searching && (
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Search for a book to add it to this list.
                  </p>
                )}
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-amber-50/70 dark:bg-slate-700/60"
                  >
                    <div className="h-14 w-10 bg-amber-200/80 dark:bg-slate-600 rounded-lg overflow-hidden flex items-center justify-center">
                      {result.coverImage ? (
                        <img src={result.coverImage} alt={result.title} className="h-full w-full object-cover" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-amber-700 dark:text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{result.title}</p>
                      <p className="text-xs text-gray-600 dark:text-slate-400">{result.author}</p>
                    </div>
                    <button
                      onClick={() => addBookToList(result.id)}
                      disabled={addingIds.has(result.id)}
                      className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-xs"
                    >
                      {addingIds.has(result.id) ? "Adding..." : "Add"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
