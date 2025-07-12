'use client';

import React from 'react';
import { BookOpen, Star, Clock, User, MoreHorizontal } from 'lucide-react';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  rating?: number;
  readingProgress?: number;
  timeToRead?: string;
  genre?: string;
  isCurrentlyReading?: boolean;
  onBookClick?: (id: string) => void;
  onMoreClick?: (id: string) => void;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  coverImage,
  rating = 0,
  readingProgress = 0,
  timeToRead,
  genre,
  isCurrentlyReading = false,
  onBookClick,
  onMoreClick,
  className = '',
}) => {
  const handleBookClick = () => {
    onBookClick?.(id);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoreClick?.(id);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) ? 'text-safety-orange-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div
      className={`card p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${className}`}
      onClick={handleBookClick}
    >
      <div className="flex space-x-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={`Cover of ${title}`}
              className="w-16 h-20 object-cover rounded-md shadow-sm"
            />
          ) : (
            <div className="w-16 h-20 bg-gradient-to-br from-indigo-dye-100 to-safety-orange-100 rounded-md flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-indigo-dye-600" />
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {title}
              </h3>
              <p className="text-xs text-gray-600 mt-1 flex items-center">
                <User className="h-3 w-3 mr-1" />
                {author}
              </p>
            </div>
            
            <button
              onClick={handleMoreClick}
              className="btn-ghost p-1 ml-2 flex-shrink-0"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center space-x-1 mt-2">
              {renderStars(rating)}
              <span className="text-xs text-gray-500 ml-1">
                {rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Reading Progress */}
          {readingProgress > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(readingProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-indigo-dye-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
            {timeToRead && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {timeToRead}
              </div>
            )}
            {genre && (
              <span className="badge-primary text-xs">
                {genre}
              </span>
            )}
          </div>

          {/* Currently Reading Badge */}
          {isCurrentlyReading && (
            <div className="mt-2">
              <span className="badge-success text-xs">
                Currently Reading
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
