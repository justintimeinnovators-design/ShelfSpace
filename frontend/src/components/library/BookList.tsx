'use client';

import React from 'react';
import { Book } from '../../../types/library';
import { BookOpen, CheckCircle, Bookmark, Star } from 'lucide-react';

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {

  const getStatusBadge = (book: Book) => {
    if (book.isCurrentlyReading) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-dye-100 text-indigo-dye-800">
          <BookOpen className="h-3 w-3 mr-1" />
          Reading
        </span>
      );
    }
    if (book.isRead) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-verdigris-100 text-verdigris-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Read
        </span>
      );
    }
    if (book.isWishlist) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-safety-orange-100 text-safety-orange-800">
          <Bookmark className="h-3 w-3 mr-1" />
          Wishlist
        </span>
      );
    }
    return null;
  };

  return (
    <div className='space-y-6'>
      {books.map((book) => (
        <div key={book.id} className="flex items-center space-x-4 p-4 border rounded-lg shadow-sm bg-white">
          <img src={book.coverImage} alt={book.title} className="w-16 h-24 object-cover rounded" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{book.title}</h4>
            <p className="text-sm text-gray-500">{book.author}</p>
            <p className="text-xs text-gray-400">{book.genre} • {book.timeToRead}</p>
            <p className="text-xs text-gray-400">Progress: {book.readingProgress}%</p>
            <p className="text-xs text-yellow-500">⭐ {book.rating}</p>
          </div>
          <div className="flex flex-col space-y-2">
            {getStatusBadge(book)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;