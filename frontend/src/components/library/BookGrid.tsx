"use client";

import React from "react";
import { memo, useMemo } from "react";
import { Book } from "@/types/book";
import { BookCard } from "@/components/common/BookCard";
import { VirtualBookGrid } from "@/components/library/VirtualBookGrid";
import { useVirtualScrolling } from "@/hooks/library/useVirtualScrolling";

interface BookGridProps {
  books: Book[];
  onBookSelect?: (book: Book) => void;
  className?: string;
}

const BookGrid: React.FC<BookGridProps> = memo(
  ({ books, className = "" }) => {
    const { shouldUseVirtual, itemHeight, itemsPerRow, overscan } =
      useVirtualScrolling({
        itemCount: books.length,
        viewMode: "grid",
        threshold: 50,
      });

    // Memoize the book items to prevent unnecessary re-renders
    const bookItems = useMemo(
      () => books.map((book) => <BookCard key={book.id} book={book} />),
      [books]
    );

    // Use virtual scrolling for large lists
    if (shouldUseVirtual) {
      return (
        <VirtualBookGrid
          books={books}
          itemHeight={itemHeight}
          itemsPerRow={itemsPerRow}
          overscan={overscan}
          className={className}
        />
      );
    }

    // Regular grid for smaller lists
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ${className}`}
        role="grid"
        aria-label={`Grid of ${books.length} books`}
      >
        {bookItems}
      </div>
    );
  }
);

BookGrid.displayName = "BookGrid";

export default BookGrid;
