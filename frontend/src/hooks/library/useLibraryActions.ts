"use client";

import { useCallback } from "react";
import { Book, ReadingList } from "../../types/library";
import { libraryService } from "@/services/libraryService";
import { toBookSlug } from "@/lib/book-slug";
// Note: The data version of useLibraryActions has different API
// import { useLibraryActions as useLibraryActionsData } from "../data/useLibraryActions";

interface UseLibraryActionsProps {
  onBookUpdate?: (book: Book) => void;
  onListUpdate?: (list: ReadingList) => void;
  onError?: (error: Error) => void;
}

/**
 * Use Library Actions.
 * @param {
  onBookUpdate: _onBookUpdate,
  onListUpdate: _onListUpdate,
  onError: _onError,
} - { on Book Update: on Book Update, on List Update: on List Update, on Error: on Error, } value.
 */
export function useLibraryActions({
  onBookUpdate: _onBookUpdate,
  onListUpdate: _onListUpdate,
  onError: _onError,
}: UseLibraryActionsProps = {}) {
  // Book actions
  const handleAddBookToList = useCallback(
    async (book: Book, listId: string) => {
      try {
        const response = await libraryService.addBooksToReadingList(listId, [
          book.id,
        ]);
        if (response?.data) {
          _onListUpdate?.(response.data as any);
        }
        return book;
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error("Failed to add book to list");
        _onError?.(errorObj);
        throw errorObj;
      }
    },
    [_onError, _onListUpdate]
  );

  const handleRemoveBookFromList = useCallback(
    async (bookId: string, listId: string) => {
      try {
        await libraryService.removeBooksFromReadingList(listId, [bookId]);
      } catch (error) {
        const errorObj =
          error instanceof Error
            ? error
            : new Error("Failed to remove book from list");
        _onError?.(errorObj);
        throw errorObj;
      }
    },
    [_onError]
  );

  const handleUpdateBookProgress = useCallback(
    async (bookId: string, progress: number) => {
      try {
        const response = await libraryService.updateBook({
          id: bookId,
          updates: {
            readingProgress: progress,
          },
        });
        const updated = response?.data as Book;
        _onBookUpdate?.(updated);
        return updated;
      } catch (error) {
        const errorObj =
          error instanceof Error
            ? error
            : new Error("Failed to update book progress");
        _onError?.(errorObj);
        throw errorObj;
      }
    },
    [_onBookUpdate, _onError]
  );

  const handleUpdateBookRating = useCallback(
    async (bookId: string, rating: number) => {
      try {
        const response = await libraryService.updateBook({
          id: bookId,
          updates: {
            rating,
          },
        });
        const updated = response?.data as Book;
        _onBookUpdate?.(updated);
        return updated;
      } catch (error) {
        const errorObj =
          error instanceof Error
            ? error
            : new Error("Failed to update book rating");
        _onError?.(errorObj);
        throw errorObj;
      }
    },
    [_onBookUpdate, _onError]
  );

  // Reading list actions
  const handleCreateReadingList = useCallback(
    async (listData: Omit<ReadingList, "id" | "books">) => {
      try {
        const listInput = {
          name: listData.name,
          ...(listData.description ? { description: listData.description } : {}),
          ...(listData.color ? { color: listData.color } : {}),
          ...(listData.icon ? { icon: listData.icon } : {}),
          ...(typeof listData.isPublic === "boolean" ? { isPublic: listData.isPublic } : {}),
          ...(listData.bookIds?.length ? { bookIds: listData.bookIds } : {}),
        };
        const response = await libraryService.createReadingList({
          list: listInput as any,
        });
        const created = response?.data as any;
        _onListUpdate?.(created);
        return created;
      } catch (error) {
        const errorObj =
          error instanceof Error
            ? error
            : new Error("Failed to create reading list");
        _onError?.(errorObj);
        throw errorObj;
      }
    },
    [_onError, _onListUpdate]
  );

  const handleUpdateReadingList = useCallback(
    async (listId: string, updates: Partial<ReadingList>) => {
      try {
        const updateInput = {
          ...(updates.name ? { name: updates.name } : {}),
          ...(updates.description ? { description: updates.description } : {}),
          ...(updates.color ? { color: updates.color } : {}),
          ...(updates.icon ? { icon: updates.icon } : {}),
          ...(typeof updates.isPublic === "boolean" ? { isPublic: updates.isPublic } : {}),
          ...(updates.bookIds ? { bookIds: updates.bookIds } : {}),
        };
        const response = await libraryService.updateReadingList({
          id: listId,
          updates: updateInput as any,
        });
        const updated = response?.data as any;
        _onListUpdate?.(updated);
        return updated;
      } catch (error) {
        const errorObj =
          error instanceof Error
            ? error
            : new Error("Failed to update reading list");
        _onError?.(errorObj);
        throw errorObj;
      }
    },
    [_onError, _onListUpdate]
  );

  const handleDeleteReadingList = useCallback(
    async (listId: string) => {
      try {
        await libraryService.deleteReadingList({ id: listId });
      } catch (error) {
        const errorObj =
          error instanceof Error
            ? error
            : new Error("Failed to delete reading list");
        _onError?.(errorObj);
        throw errorObj;
      }
    },
    [_onError]
  );

  // Navigation actions
  const handleViewBook = useCallback((book: Book) => {
    // Navigate to book detail page
    window.location.href = `/book/${toBookSlug(book)}`;
  }, []);

  const handleEditBook = useCallback((book: Book) => {
    // Open book edit modal or navigate to edit page
    if (_onBookUpdate) {
      _onBookUpdate(book);
      return;
    }
    window.location.href = `/book/${toBookSlug(book)}?mode=edit`;
  }, [_onBookUpdate]);

  return {
    // Book actions
    addBookToList: handleAddBookToList,
    removeBookFromList: handleRemoveBookFromList,
    updateBookProgress: handleUpdateBookProgress,
    updateBookRating: handleUpdateBookRating,
    viewBook: handleViewBook,
    editBook: handleEditBook,

    // Reading list actions
    createReadingList: handleCreateReadingList,
    updateReadingList: handleUpdateReadingList,
    deleteReadingList: handleDeleteReadingList,
  };
}
