"use client";

import React from "react";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookCard } from "@/components/common/BookCard";
import { Book } from "@/types/book";

interface GenreSection {
  genre: string;
  books: Book[];
}

interface GenreCarouselProps {
  sections: GenreSection[];
}

const GenreCarousel: React.FC<GenreCarouselProps> = ({ sections }) => {
  const scrollContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollLeft = (index: number) => {
    if (scrollContainerRefs.current[index]) {
      scrollContainerRefs.current[index]?.scrollBy({
        left: -400,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = (index: number) => {
    if (scrollContainerRefs.current[index]) {
      scrollContainerRefs.current[index]?.scrollBy({
        left: 400,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-3 ml-2">Genres</h2>
      {sections.map((section, index) => (
        <div key={section.genre} className="mb-8">
          <h3 className="text-base font-semibold text-indigo-dye-700 mb-3 ml-2">
            {section.genre}
          </h3>
          <div className="relative group">
            {/* Left Arrow */}
            <button
              onClick={() => scrollLeft(index)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            {/* Right Arrow */}
            <button
              onClick={() => scrollRight(index)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
            <div
              ref={(el) => { scrollContainerRefs.current[index] = el; }}
              className="flex overflow-x-auto no-scrollbar pb-2 px-4 py-4"
            >
              {section.books.map((book: Book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default GenreCarousel;
