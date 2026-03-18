"use client";

import { useMemo } from "react";
import { Book, ReadingList } from "../../types/library";

interface UseLibrarySelectorsProps {
  readingLists: ReadingList[];
  selectedListId: string;
  books: Book[];
}

/**
 * Use Library Selectors.
 * @param {
  readingLists,
  selectedListId,
  books,
} - { reading Lists, selected List Id, books, } value.
 */
export function useLibrarySelectors({
  readingLists,
  selectedListId,
  books,
}: UseLibrarySelectorsProps) {
  // Memoized selector for current reading list
  const currentList = useMemo(
    () => readingLists.find((list) => list.id === selectedListId),
    [readingLists, selectedListId]
  );

  // Memoized selector for current list books
  const currentListBooks = useMemo(
    () => currentList?.books || [],
    [currentList]
  );

  // Memoized selector for reading statistics
  const readingStats = useMemo(() => {
    const totalBooks = books.length;
    const currentlyReading = books.filter(
      (book) => book.status === "currently-reading"
    ).length;
    const completed = books.filter((book) => book.status === "read").length;
    const wantToRead = books.filter(
      (book) => book.status === "want-to-read"
    ).length;

    return {
      totalBooks,
      currentlyReading,
      completed,
      wantToRead,
      completionRate:
        totalBooks > 0 ? Math.round((completed / totalBooks) * 100) : 0,
    };
  }, [books]);

  // Memoized selector for available genres
  const availableGenres = useMemo(() => {
    const genres = new Set(
      books.flatMap((book) => book.genres || []).filter(Boolean)
    );
    return Array.from(genres).sort();
  }, [books]);

  // Memoized selector for recently added books
  const recentlyAddedBooks = useMemo(() => {
    return [...books]
      .filter((book) => book.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      )
      .slice(0, 5);
  }, [books]);

  // Memoized selector for currently reading books with progress
  const booksInProgress = useMemo(() => {
    return books
      .filter(
        (book) =>
          book.status === "currently-reading" &&
          book.readingProgress !== undefined
      )
      .sort((a, b) => (b.readingProgress || 0) - (a.readingProgress || 0));
  }, [books]);

  // Memoized selector for highly rated books
  const topRatedBooks = useMemo(() => {
    return [...books]
      .filter((book) => book.rating && book.rating >= 4.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);
  }, [books]);

  // Memoized selector for books by genre
  const booksByGenre = useMemo(() => {
    const genreMap = new Map<string, Book[]>();

    books.forEach((book) => {
      if (book.genres) {
        book.genres.forEach((genre) => {
          if (!genreMap.has(genre)) {
            genreMap.set(genre, []);
          }
          genreMap.get(genre)!.push(book);
        });
      }
    });

    return genreMap;
  }, [books]);

  // Memoized selector for reading list summary
  const readingListSummary = useMemo(() => {
    return readingLists.map((list) => ({
      id: list.id,
      name: list.name,
      bookCount: list.books?.length || 0,
      color: list.color,
      icon: list.icon,
      isDefault: list.isDefault,
      lastUpdated:
        list.books && list.books.length > 0
          ? Math.max(
              ...list.books.map((book) =>
                new Date((book as any).createdAt || 0).getTime()
              )
            )
          : 0,
    }));
  }, [readingLists]);

  return {
    currentList,
    currentListBooks,
    readingStats,
    availableGenres,
    recentlyAddedBooks,
    booksInProgress,
    topRatedBooks,
    booksByGenre,
    readingListSummary,
  };
}
