'use client';

import React from 'react';
import { Book } from '../../../types/library';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
}

const BookGrid: React.FC<BookGridProps> = ({ books }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
};

export default BookGrid;