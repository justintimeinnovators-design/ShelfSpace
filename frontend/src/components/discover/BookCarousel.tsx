
'use client';

import React from 'react';
import BookCard, { Book } from '../../components/common/BookCard';

interface BookCarouselProps {
  title: string;
  books: Book[];
}

const BookCarousel: React.FC<BookCarouselProps> = ({ title, books }) => {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-3 ml-2">{title}</h2>
      <div className="flex overflow-x-auto no-scrollbar pb-2 px-4 py-4 space-x-4">
        {books.map((book) => (
          <div key={book.id} className="min-w-[150px]">
            <BookCard {...book} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BookCarousel;
