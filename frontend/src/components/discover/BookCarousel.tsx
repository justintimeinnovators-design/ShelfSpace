
'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard, { Book } from '../common/BookCard';

interface BookCarouselProps {
  title: string;
  books: Book[];
}

const BookCarousel: React.FC<BookCarouselProps> = ({ title, books }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-3 ml-2">{title}</h2>
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar pb-2 px-4 py-4"
        >
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookCarousel;
