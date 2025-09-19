
'use client';

import React from 'react';
import { Book } from '../../../types/library';
import BookCard from '../common/BookCard';

interface BookListProps {
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <div className="space-y-4">
      {books.map(book => (
        <BookCard
          key={book.id}
          {...book}
          viewMode="list"
        />
      ))}
    </div>
  );
};

export default BookList;
