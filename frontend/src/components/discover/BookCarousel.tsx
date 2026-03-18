"use client";

import React from "react";
import { BookCard } from "@/components/common/BookCard";
import { Book } from "@/types/book";

interface BookCarouselProps {
  title: string;
  books: Book[];
}

/**
 * Book Carousel.
 * @param { title, books } - { title, books } value.
 */
const BookCarousel: React.FC<BookCarouselProps> = ({ title, books }) => {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 px-2">
        {title}
      </h2>
      <div className="flex overflow-x-auto scrollbar-hide pb-2 px-2 space-x-4">
        {books.map((book) => (
          <div key={book.id} className="min-w-[150px] flex-shrink-0">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookCarousel;
