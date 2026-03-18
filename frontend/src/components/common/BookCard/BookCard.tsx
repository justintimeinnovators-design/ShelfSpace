"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";
import { BookOpen, Bookmark, BookmarkCheck } from "lucide-react";
import { toBookSlug } from "@/lib/book-slug";
import { libraryService } from "@/services/libraryService";
import { useToast } from "@/hooks/useToast";
import { ReadingList } from "@/types/library";

interface BookCardProps {
  book: Book;
  onSelect?: (book: Book) => void;
  className?: string;
  onSave?: (book: Book) => void;
  isSaved?: boolean;
  isSaving?: boolean;
  showSave?: boolean;
}

/**
 * Book Card.
 * @param {
  book,
  onSelect,
  className = "",
  onSave,
  isSaved = false,
  isSaving = false,
  showSave = true,
} - { book, on Select, class Name = "", on Save, is Saved = false, is Saving = false, show Save = true, } value.
 */
export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelect,
  className = "",
  onSave,
  isSaved = false,
  isSaving = false,
  showSave = true,
}) => {
  const router = useRouter();
  const toast = useToast();
  const [isSavingInternal, setIsSavingInternal] = useState(false);
  const [isSavedInternal, setIsSavedInternal] = useState(false);
  const [listCache, setListCache] = useState<ReadingList[] | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveTargetListId, setSaveTargetListId] = useState("");
  const [saveListError, setSaveListError] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [isCreatingList, setIsCreatingList] = useState(false);

/**
 * Handle Click.
 */
  const handleClick = () => {
    if (onSelect) {
      onSelect(book);
    } else {
      router.push(`/book/${toBookSlug(book)}`);
    }
  };

/**
 * Handle Key Down.
 * @param event - event value.
 */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  const loadReadingLists = useCallback(async () => {
    const response = await libraryService.getReadingLists({ includeBooks: false });
    setListCache(response.data as any);
    return response.data as any;
  }, []);

  const ensureDefaultList = useCallback(async () => {
    let lists = listCache || (await loadReadingLists());
    if (!lists || lists.length === 0) {
      await libraryService.initializeDefaults();
      lists = await loadReadingLists();
    }
    return lists;
  }, [listCache, loadReadingLists]);

  const handleDefaultSave = useCallback(async () => {
    if (isSavingInternal || isSavedInternal) return;
    try {
      setSaveListError(null);
      const lists = await ensureDefaultList();
      const want = lists.find((list: ReadingList) =>
        list.name.toLowerCase().includes("want")
      );
      setSaveTargetListId(want?.id || (lists[0]?.id ?? ""));
      setIsSaveModalOpen(true);
    } catch (error) {
      toast.error("Failed to load lists. Please sign in and try again.");
    }
  }, [ensureDefaultList, isSavingInternal, isSavedInternal, toast]);

  const handleCreateList = useCallback(async () => {
    const name = newListName.trim();
    if (!name) {
      setSaveListError("Please enter a list name.");
      return;
    }
    setIsCreatingList(true);
    try {
      const created = await libraryService.createReadingList({
        list: { name },
      });
      const lists = await loadReadingLists();
      setSaveTargetListId((created.data as any)?.id || lists[0]?.id || "");
      setNewListName("");
      setSaveListError(null);
    } catch (err: any) {
      setSaveListError(err?.message || "Failed to create list");
    } finally {
      setIsCreatingList(false);
    }
  }, [newListName, loadReadingLists]);

  const confirmSave = useCallback(async () => {
    if (!saveTargetListId) {
      setSaveListError("Please select a list.");
      return;
    }
    setIsSavingInternal(true);
    try {
      await libraryService.addBooksToReadingList(saveTargetListId, [book.id]);
      setIsSavedInternal(true);
      setIsSaveModalOpen(false);
      toast.success("Saved to your library.");
    } catch (error) {
      toast.error("Failed to save book. Please sign in and try again.");
    } finally {
      setIsSavingInternal(false);
    }
  }, [book.id, saveTargetListId, toast]);

  const resolvedIsSaved = isSaved || isSavedInternal;
  const resolvedIsSaving = isSaving || isSavingInternal;
  const handleSave = onSave ? () => onSave(book) : handleDefaultSave;

  const showSaveButton = showSave;

/**
 * Get Status Color.
 * @param status - status value.
 */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "read":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
      case "currently-reading":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200";
      case "want-to-read":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <>
      <article
        className={`
          bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg border border-amber-200 dark:border-slate-700
          shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
          ${className}
        `}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${book.title} by ${book.author}`}
      >
        {/* Cover Image */}
        <div className="relative aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-200 dark:from-slate-700 dark:to-slate-600 rounded-t-lg flex items-center justify-center">
          {showSaveButton && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleSave();
              }}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 border border-amber-200 dark:border-slate-600 text-amber-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors"
              aria-label={resolvedIsSaved ? "Saved to library" : "Save to library"}
              disabled={resolvedIsSaving}
            >
              {resolvedIsSaved ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>
          )}
          {book.coverImage || book.cover ? (
            <img
              src={book.coverImage || book.cover}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="text-amber-600 dark:text-slate-400 text-4xl font-serif">
              <BookOpen className="h-10 w-10" />
            </div>
          )}
        </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm line-clamp-2 mb-1">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-gray-600 dark:text-slate-400 text-xs mb-3 line-clamp-1">
          by {book.author}
        </p>

        {/* Status Badge */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${getStatusColor(book.status)}
            `}
          >
            {book.status.replace("-", " ")}
          </span>
          {book.rating && (
            <span className="text-xs text-gray-500 dark:text-slate-400">
              ⭐ {book.rating}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {book.status === "currently-reading" && (
          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2 mb-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${book.progress}%` }}
            />
          </div>
        )}

        {/* Genres */}
        {book.genres && book.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {book.genres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-xs bg-amber-100 dark:bg-slate-700 text-amber-700 dark:text-slate-300 px-2 py-1 rounded"
              >
                {genre}
              </span>
            ))}
            {book.genres.length > 2 && (
              <span className="text-xs text-gray-500 dark:text-slate-400">
                +{book.genres.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
      </article>

      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-200 dark:border-slate-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
              Add to Reading List
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
              Choose where to save this book.
            </p>

            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Select List
            </label>
            <select
              value={saveTargetListId}
              onChange={(e) => setSaveTargetListId(e.target.value)}
              className="w-full px-4 py-3 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {(listCache || []).map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Or create a new list
              </label>
              <div className="flex gap-2">
                <input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-amber-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="List name"
                />
                <button
                  onClick={handleCreateList}
                  disabled={isCreatingList}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded-lg transition-colors"
                >
                  {isCreatingList ? "Creating..." : "Create"}
                </button>
              </div>
            </div>

            {saveListError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-3">
                {saveListError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                disabled={!saveTargetListId || resolvedIsSaving}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white transition-colors"
              >
                {resolvedIsSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
