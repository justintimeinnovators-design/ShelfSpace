"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";
import { toBookSlug } from "@/lib/book-slug";

export interface BookCardActions {
  onView?: (book: Book) => void | undefined;
  onEdit?: (book: Book) => void | undefined;
  onRemove?: (book: Book) => void | undefined;
  onAddToList?: (book: Book) => void | undefined;
  onMore?: (book: Book) => void | undefined;
}

export interface UseBookCardProps {
  book: Book;
  actions?: BookCardActions | undefined;
  onClick?: ((book: Book) => void) | undefined;
}

/**
 * Use Book Card.
 * @param { book, actions, onClick } - { book, actions, on Click } value.
 */
export function useBookCard({ book, actions, onClick }: UseBookCardProps) {
  const router = useRouter();

  const handleBookClick = useCallback(() => {
    if (onClick) {
      onClick(book);
    } else if (actions?.onView) {
      actions.onView(book);
    } else {
      router.push(`/book/${toBookSlug(book)}`);
    }
  }, [router, book, onClick, actions]);

  const getCoverUrl = useCallback((title: string, cover?: string) => {
    if (cover) return cover;
    return `/book-covers/${title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")}.jpg`;
  }, []);

  const getStatusColor = useCallback((status: string) => {
    if (!status) return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    
    switch (status) {
      case "reading":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "want-to-read":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "paused":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  }, []);

  const formatStatus = useCallback((status: string) => {
    if (!status) return "";
    return status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }, []);

  const coverUrl = useMemo(
    () => getCoverUrl(book.title, book.cover),
    [getCoverUrl, book.title, book.cover]
  );

  const statusColor = useMemo(
    () => getStatusColor(book.status),
    [getStatusColor, book.status]
  );

  const formattedStatus = useMemo(
    () => formatStatus(book.status),
    [formatStatus, book.status]
  );

  return {
    handleBookClick,
    coverUrl,
    statusColor,
    formattedStatus,
  };
}
