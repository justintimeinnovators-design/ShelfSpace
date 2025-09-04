
'use client';

import React from 'react';
import { Book } from '../../../types/library';
import { Star } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => (
    <div
      className="relative group rounded-lg overflow-hidden shadow-md border border-gray-200 bg-white transition-all duration-300 hover:shadow-2xl hover:scale-110 focus-within:scale-110 z-0 hover:z-20 focus-within:z-20"
      style={{ aspectRatio: '2/3', width: '180px', minWidth: '180px', maxWidth: '180px' }}
      tabIndex={0}
    >
      {/* Book Cover */}
      <img
        src={book.coverImage}
        alt={book.title + ' cover'}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Title Overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-3 py-2 flex items-end pointer-events-none">
        <span className="text-white text-base font-semibold truncate w-full drop-shadow-md">{book.title}</span>
      </div>
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-10 px-4 py-4">
        {/* Full Title & Author */}
        <div className="mb-4 w-full text-center">
          <div className="text-lg font-bold text-white leading-tight mb-1 break-words">{book.title}</div>
          <div className="text-sm text-gray-200 mb-2 break-words">{book.author}</div>
        </div>
        <div className="flex flex-col items-center space-y-2 w-full">
          {book.rating && (
            <div className="flex items-center space-x-1 text-yellow-400 text-base">
              <Star className="h-5 w-5 fill-yellow-400" />
              <span className="font-semibold text-white">{book.rating}</span>
            </div>
          )}
          {book.readingProgress !== undefined && (
            <div className="w-32">
              <div className="flex justify-between text-xs text-gray-200 mb-1">
                <span>Progress</span>
                <span>{book.readingProgress}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-indigo-dye-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${book.readingProgress}%` }}
                />
              </div>
            </div>
          )}
          {book.pages && (
            <div className="text-xs text-gray-200 mt-2">{book.pages} pages</div>
          )}
        </div>
      </div>
    </div>
  );

  export default BookCard;
