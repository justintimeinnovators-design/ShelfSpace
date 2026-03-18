"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";
import { BookOpen, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toBookSlug } from "@/lib/book-slug";

interface BookListItemProps {
  book: Book;
  onSelect?: (book: Book) => void;
  onSave?: (book: Book) => void;
  isSaved?: boolean;
  isSaving?: boolean;
}

/**
 * Book List Item.
 * @param {
  book,
  onSelect,
  onSave,
  isSaved = false,
  isSaving = false,
} - { book, on Select, on Save, is Saved = false, is Saving = false, } value.
 */
export const BookListItem: React.FC<BookListItemProps> = ({
  book,
  onSelect,
  onSave,
  isSaved = false,
  isSaving = false,
}) => {
  const router = useRouter();

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
    <div
      className="
        bg-white/90 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg border border-amber-200 dark:border-slate-700
        p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
      "
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${book.title} by ${book.author}`}
    >
    <div className="flex items-center space-x-4">
        {/* Cover Image */}
        <div className="w-16 h-20 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-slate-700 dark:to-slate-600 rounded flex items-center justify-center flex-shrink-0">
          {book.coverImage || book.cover ? (
            <img
              src={book.coverImage || book.cover}
              alt={`Cover of ${book.title}`}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="text-amber-600 dark:text-slate-400 text-xl">
              <BookOpen className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-lg line-clamp-1">
                {book.title}
              </h3>
              <p className="text-gray-600 dark:text-slate-400 text-sm mt-1">
                by {book.author}
              </p>
              {book.description && (
                <p className="text-gray-500 dark:text-slate-500 text-sm mt-2 line-clamp-2">
                  {book.description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-3 ml-4">
              {onSave && (
                <Button
                  onClick={(event) => {
                    event.stopPropagation();
                    onSave(book);
                  }}
                  variant="secondary"
                  size="sm"
                  disabled={isSaving}
                  leftIcon={isSaved ? BookmarkCheck : Bookmark}
                >
                  {isSaved ? "Saved" : "Save"}
                </Button>
              )}
              {/* Status */}
              <span
                className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${getStatusColor(book.status)}
                `}
              >
                {book.status.replace("-", " ")}
              </span>

              {/* Rating */}
              {book.rating && (
                <span className="text-sm text-gray-600 dark:text-slate-400">
                  ⭐ {book.rating}
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {book.status === "currently-reading" && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 mb-1">
                <span>Progress</span>
                <span>{book.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${book.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Genres */}
          {book.genres && book.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {book.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="text-xs bg-amber-100 dark:bg-slate-700 text-amber-700 dark:text-slate-300 px-2 py-1 rounded"
                >
                  {genre}
                </span>
              ))}
              {book.genres.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  +{book.genres.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
