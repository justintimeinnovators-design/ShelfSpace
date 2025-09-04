'use client';

import React from 'react';
import { Recommendation } from '../../../types/models';

interface RecommendationCardProps extends Recommendation {
  coverImage: string;
  rating: number;
  onClick?: () => void;
  cardIndex?: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  id,  // number
  title,
  author,
  coverImage,
  rating,
  reason,
  onClick,
  cardIndex,
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition"
    >
      <img src={coverImage} alt={title} className="w-full h-40 object-cover rounded" />
      <h4 className="mt-2 font-semibold text-gray-900 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-300">{author}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Reason: {reason}</p>
      <p className="text-xs text-yellow-500 mt-1">⭐ {rating}</p>
    </div>
  );
};

export default RecommendationCard;
