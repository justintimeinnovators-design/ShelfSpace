"use client";

import React from "react";
import { memo } from "react";
import { Book } from "@/types/book";
import { BookListItem } from "@/components/library/components/BookListItem";

interface BookListProps {
  books: Book[];
  onBookSelect?: (book: Book) => void;
  className?: string;
}

const BookList: React.FC<BookListProps> = memo(
  ({ books, onBookSelect, className = "" }) => {
    return (
      <div
        className={`space-y-4 ${className}`}
        role="list"
        aria-label={`List of ${books.length} books`}
      >
        {books.map((book) => (
          <BookListItem
            key={book.id}
            book={book}
            {...(onBookSelect && { onSelect: onBookSelect })}
          />
        ))}
      </div>
    );
  }
);

BookList.displayName = "BookList";

export default BookList;