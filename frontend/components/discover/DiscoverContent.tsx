"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const carousels = [
  {
    title: "Genres",
    key: "genres",
    sections: [
      {
        genre: "Fiction",
        books: [
          {
            id: 1,
            title: "The Midnight Library",
            author: "Matt Haig",
            cover: "/book-covers/midnight-library.jpg",
            rating: 4.3,
          },
          {
            id: 2,
            title: "The Name of the Wind",
            author: "Patrick Rothfuss",
            cover: "/book-covers/name-of-the-wind.jpg",
            rating: 5.0,
          },
          {
            id: 3,
            title: "The Seven Husbands of Evelyn Hugo",
            author: "Taylor Jenkins Reid",
            cover: "/book-covers/new-cover.jpg",
            rating: 4.5,
          },
          {
            id: 4,
            title: "Klara and the Sun",
            author: "Kazuo Ishiguro",
            cover: "/book-covers/design-of-everyday-things.jpg",
            rating: 4.2,
          },
          {
            id: 5,
            title: "The Thursday Murder Club",
            author: "Richard Osman",
            cover: "/book-covers/thinking-fast-slow.jpg",
            rating: 4.1,
          },
        ],
      },
      {
        genre: "Science Fiction",
        books: [
          {
            id: 6,
            title: "Dune",
            author: "Frank Herbert",
            cover: "/book-covers/dune.jpg",
            rating: 4.9,
          },
          {
            id: 7,
            title: "Project Hail Mary",
            author: "Andy Weir",
            cover: "/book-covers/project-hail-mary.jpg",
            rating: 4.6,
          },
          {
            id: 8,
            title: "The Martian",
            author: "Andy Weir",
            cover: "/book-covers/atomic-habits.jpg",
            rating: 4.7,
          },
          {
            id: 9,
            title: "Foundation",
            author: "Isaac Asimov",
            cover: "/book-covers/sapiens.jpg",
            rating: 4.4,
          },
          {
            id: 10,
            title: "Neuromancer",
            author: "William Gibson",
            cover: "/book-covers/deep-work.jpg",
            rating: 4.3,
          },
        ],
      },
      {
        genre: "Memoir",
        books: [
          {
            id: 11,
            title: "Educated",
            author: "Tara Westover",
            cover: "/book-covers/educated.jpg",
            rating: 4.8,
          },
          {
            id: 12,
            title: "Becoming",
            author: "Michelle Obama",
            cover: "/book-covers/lean-startup.jpg",
            rating: 4.6,
          },
          {
            id: 13,
            title: "Born a Crime",
            author: "Trevor Noah",
            cover: "/book-covers/midnight-library.jpg",
            rating: 4.7,
          },
          {
            id: 14,
            title: "The Glass Castle",
            author: "Jeannette Walls",
            cover: "/book-covers/name-of-the-wind.jpg",
            rating: 4.5,
          },
        ],
      },
      {
        genre: "Business",
        books: [
          {
            id: 15,
            title: "The Lean Startup",
            author: "Eric Ries",
            cover: "/book-covers/lean-startup.jpg",
            rating: 4.4,
          },
          {
            id: 16,
            title: "Zero to One",
            author: "Peter Thiel",
            cover: "/book-covers/thinking-fast-slow.jpg",
            rating: 4.3,
          },
          {
            id: 17,
            title: "Good to Great",
            author: "Jim Collins",
            cover: "/book-covers/design-of-everyday-things.jpg",
            rating: 4.2,
          },
          {
            id: 18,
            title: "Built to Last",
            author: "Jim Collins",
            cover: "/book-covers/new-cover.jpg",
            rating: 4.1,
          },
        ],
      },
    ],
  },
  {
    title: "Users Liked This",
    key: "liked",
    books: [
      {
        id: 19,
        title: "Atomic Habits",
        author: "James Clear",
        cover: "/book-covers/atomic-habits.jpg",
        rating: 4.8,
      },
      {
        id: 20,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        cover: "/book-covers/sapiens.jpg",
        rating: 4.6,
      },
      {
        id: 21,
        title: "Deep Work",
        author: "Cal Newport",
        cover: "/book-covers/deep-work.jpg",
        rating: 4.5,
      },
      {
        id: 22,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        cover: "/book-covers/thinking-fast-slow.jpg",
        rating: 4.7,
      },
      {
        id: 23,
        title: "The Design of Everyday Things",
        author: "Don Norman",
        cover: "/book-covers/design-of-everyday-things.jpg",
        rating: 4.5,
      },
      {
        id: 24,
        title: "Educated",
        author: "Tara Westover",
        cover: "/book-covers/educated.jpg",
        rating: 4.8,
      },
      {
        id: 25,
        title: "Dune",
        author: "Frank Herbert",
        cover: "/book-covers/dune.jpg",
        rating: 4.9,
      },
    ],
  },
  {
    title: "Popular This Month",
    key: "popular",
    books: [
      {
        id: 26,
        title: "The Lean Startup",
        author: "Eric Ries",
        cover: "/book-covers/lean-startup.jpg",
        rating: 4.4,
      },
      {
        id: 27,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        cover: "/book-covers/thinking-fast-slow.jpg",
        rating: 4.7,
      },
      {
        id: 28,
        title: "The Design of Everyday Things",
        author: "Don Norman",
        cover: "/book-covers/design-of-everyday-things.jpg",
        rating: 4.5,
      },
      {
        id: 29,
        title: "Project Hail Mary",
        author: "Andy Weir",
        cover: "/book-covers/project-hail-mary.jpg",
        rating: 4.6,
      },
      {
        id: 30,
        title: "Atomic Habits",
        author: "James Clear",
        cover: "/book-covers/atomic-habits.jpg",
        rating: 4.8,
      },
      {
        id: 31,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        cover: "/book-covers/sapiens.jpg",
        rating: 4.6,
      },
      {
        id: 32,
        title: "Deep Work",
        author: "Cal Newport",
        cover: "/book-covers/deep-work.jpg",
        rating: 4.5,
      },
    ],
  },
  {
    title: "New Releases",
    key: "new",
    books: [
      {
        id: 33,
        title: "Project Hail Mary",
        author: "Andy Weir",
        cover: "/book-covers/project-hail-mary.jpg",
        rating: 4.6,
      },
      {
        id: 34,
        title: "Educated",
        author: "Tara Westover",
        cover: "/book-covers/educated.jpg",
        rating: 4.8,
      },
      {
        id: 35,
        title: "The Midnight Library",
        author: "Matt Haig",
        cover: "/book-covers/midnight-library.jpg",
        rating: 4.3,
      },
      {
        id: 36,
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        cover: "/book-covers/design-of-everyday-things.jpg",
        rating: 4.2,
      },
      {
        id: 37,
        title: "The Thursday Murder Club",
        author: "Richard Osman",
        cover: "/book-covers/thinking-fast-slow.jpg",
        rating: 4.1,
      },
    ],
  },
  {
    title: "Trending Now",
    key: "trending",
    books: [
      {
        id: 38,
        title: "Atomic Habits",
        author: "James Clear",
        cover: "/book-covers/atomic-habits.jpg",
        rating: 4.8,
      },
      {
        id: 39,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        cover: "/book-covers/sapiens.jpg",
        rating: 4.6,
      },
      {
        id: 40,
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        cover: "/book-covers/name-of-the-wind.jpg",
        rating: 5.0,
      },
      {
        id: 41,
        title: "Dune",
        author: "Frank Herbert",
        cover: "/book-covers/dune.jpg",
        rating: 4.9,
      },
      {
        id: 42,
        title: "Deep Work",
        author: "Cal Newport",
        cover: "/book-covers/deep-work.jpg",
        rating: 4.5,
      },
      {
        id: 43,
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        cover: "/book-covers/thinking-fast-slow.jpg",
        rating: 4.7,
      },
    ],
  },
];

function BookCard({ book }: { book: any }) {
  return (
    <div
      className="w-44 flex-shrink-0 bg-white rounded-lg border border-gray-200 transition-all duration-300 mx-3 flex flex-col hover:scale-103 focus-within:scale-103 z-0 hover:z-20 focus-within:z-20 shadow-none hover:shadow-lg focus-within:shadow-lg"
      tabIndex={0}
      style={{ aspectRatio: '2/3' }}
    >
      <img
        src={book.cover}
        alt={book.title + " cover"}
        className="w-full h-60 object-cover rounded-t-lg"
        loading="lazy"
      />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">{book.title}</h3>
        <p className="text-xs text-gray-600 mb-3">{book.author}</p>
        <div className="flex items-center space-x-1 text-xs text-yellow-500 mt-auto">
          <Star className="h-4 w-4 fill-yellow-400" />
          <span className="font-medium text-gray-700">{book.rating}</span>
        </div>
      </div>
    </div>
  );
}

function Carousel({ books, title }: { books: any[]; title: string }) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

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
}

function GenreCarousels({ sections }: { sections: any[] }) {
  const scrollContainerRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const scrollLeft = (index: number) => {
    if (scrollContainerRefs.current[index]) {
      scrollContainerRefs.current[index]?.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = (index: number) => {
    if (scrollContainerRefs.current[index]) {
      scrollContainerRefs.current[index]?.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-3 ml-2">Genres</h2>
      {sections.map((section, index) => (
        <div key={section.genre} className="mb-8">
          <h3 className="text-base font-semibold text-indigo-dye-700 mb-3 ml-2">{section.genre}</h3>
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
              ref={(el) => (scrollContainerRefs.current[index] = el)}
              className="flex overflow-x-auto no-scrollbar pb-2 px-4 py-4"
            >
              {section.books.map((book: any) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

const DiscoverContent: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Removed <h1>Discover</h1> page title, as it should only appear in the top bar/header */}
      {carousels.map((carousel) =>
        carousel.key === "genres" ? (
          <GenreCarousels key={carousel.key} sections={carousel.sections} />
        ) : (
          <Carousel key={carousel.key} books={carousel.books} title={carousel.title} />
        )
      )}
    </div>
  );
};

export default DiscoverContent; 