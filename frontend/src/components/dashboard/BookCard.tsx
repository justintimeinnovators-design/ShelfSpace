'use client';

import React from 'react';
import { Book } from '../../../types/models';

interface BookCardProps extends Book {
  coverImage: string;
  rating: number;
  readingProgress: number;
  timeToRead: string;
  genre: string;
  isCurrentlyReading?: boolean;
  onBookClick?: (id: string) => void;
  onMoreClick?: (id: string) => void;
}


const BookCard: React.FC<BookCardProps> = ({
  id,  // number
  title,
  author,
  coverImage,
  rating,
  readingProgress,
  timeToRead,
  genre,
  isCurrentlyReading,
  onBookClick,
  onMoreClick,
}) => {
  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <img src={coverImage} alt={title} className="w-16 h-24 object-cover rounded" />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-300">{author}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{genre} • {timeToRead}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Progress: {readingProgress}%</p>
        <p className="text-xs text-yellow-500">⭐ {rating}</p>
      </div>
      <div className="flex flex-col space-y-2">
        <button onClick={() => onBookClick?.(id.toString())} className="btn-outline">Open</button>
        <button onClick={() => onMoreClick?.(id.toString())} className="btn-outline">More</button>
      </div>
    </div>
  );
};

export default BookCard;
