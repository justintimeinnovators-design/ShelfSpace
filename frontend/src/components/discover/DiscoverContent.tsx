'use client';

import React from 'react';
import BookCarousel from './BookCarousel';
import GenreCarousel from './GenreCarousel';

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

const DiscoverContent: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {carousels.map((carousel) =>
        carousel.key === "genres" ? (
          <GenreCarousel key={carousel.key} sections={carousel?.sections || []} />
        ) : (
          <BookCarousel key={carousel.key} books={carousel?.sections?.flatMap(section => section.books) || []} title={carousel.title} />
        )
      )}
    </div>
  );
};

export default DiscoverContent;