'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import BookCard from './BookCard';
import { Book } from '../../../types/models';

interface RecentBooksSectionProps {
  currentlyReading: Book[];
}

const getCover = (title: string) => `/book-covers/${title.toLowerCase().replace(/ /g, '-')}.jpg`;

const RecentBooksSection: React.FC<RecentBooksSectionProps> = ({ currentlyReading }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleBookClick = (id: string) => {
    console.log('Book clicked:', id);
  };

  const handleBookMoreClick = (id: string) => {
    console.log('Book more options:', id);
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-h5 text-gray-900 dark:text-white">Recent Books</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pl-10 w-64"
                />
              </div>
              <button className="btn-outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {currentlyReading.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                progress={book.progress}
                cover={getCover(book.title)}
                coverImage={getCover(book.title)}
                rating={4.5}
                readingProgress={book.progress}
                timeToRead="2h 30m"
                genre="Fiction"
                isCurrentlyReading={true}
                onBookClick={handleBookClick}
                onMoreClick={handleBookMoreClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBooksSection;
