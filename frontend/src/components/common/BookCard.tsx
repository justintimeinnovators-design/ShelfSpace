
'use client';

import React from 'react';
import { Star } from 'lucide-react';

export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
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
};

export default BookCard;
