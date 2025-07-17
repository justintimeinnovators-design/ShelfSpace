'use client';

import React from 'react';
import { BookOpen, Star, Plus, User } from 'lucide-react';

interface RecommendationCardProps {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  rating: number;
  reason: string;
  onClick?: (id: string) => void;
  onAddToLibrary?: (id: string) => void;
  className?: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  id,
  title,
  author,
  coverImage,
  rating,
  reason,
  onClick,
  onAddToLibrary,
  className = '',
}) => {
  const handleClick = () => {
    onClick?.(id);
  };

  const handleAddToLibrary = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToLibrary?.(id);
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
      onClick={handleClick}
    >
      <div className="flex space-x-3">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={`Cover of ${title}`}
              className="w-12 h-16 object-cover rounded-md shadow-sm"
            />
          ) : (
            <div className="w-12 h-16 bg-gradient-to-br from-indigo-dye-100 to-safety-orange-100 rounded-md flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-indigo-dye-600" />
            </div>
          )}
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {title}
              </h4>
              <p className="text-xs text-gray-600 mt-1 flex items-center">
                <User className="h-3 w-3 mr-1" />
                {author}
              </p>
            </div>
            
            <button
              onClick={handleAddToLibrary}
              className="btn-ghost p-1 ml-2 flex-shrink-0"
              aria-label="Add to library"
            >
              <Plus className="h-4 w-4 text-gray-400" />
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

          {/* Recommendation Reason */}
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
            {reason}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
